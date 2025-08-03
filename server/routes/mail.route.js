import { Router } from "express";
import Pipeline from "../models/Pipeline.model.js"
import ContactList from "../models/ContactList.model.js"
import { emailQueue } from "../utils/emailQueue.js";
import { verifyEmails } from "../utils/sendBulkMail.js";

export const mailRouter = Router();

//verify mails
mailRouter.post("/verify-emails", async (req, res) => {
  const { emails } = req.body;

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ message: "Email list is missing or invalid." });
  }

  try {
    const result = await verifyEmails(emails);
    return res.status(200).json({
      message: "Verification emails sent.",
      result,
    });
  } catch (error) {
    console.error("Verification route error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});



//send mails
mailRouter.post("/send-emails", async (req, res) => {
  try {
    const { pipelineId } = req.body;
    
    if (!pipelineId) {
      return res.status(400).json({ error: "pipelineId is required" });
    }

    // Get pipeline with populated contacts
    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) {
      return res.status(404).json({ error: "Pipeline not found" });
    }

    // Get contact list
    const contactList = await ContactList.findOne({ name: pipeline.listname });
    
    if (!contactList || !contactList.contacts.length) {
      return res.status(404).json({ error: "Contact list not found or empty" });
    }

    const recipients = contactList.contacts;
    const steps = pipeline.steps;

    if (!steps || steps.length === 0) {
      return res.status(400).json({ error: "Pipeline has no steps configured" });
    }

    // Schedule emails for each step with delays
    const scheduledJobs = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Calculate cumulative delay (each step waits for previous steps)
      const cumulativeDelay = steps
        .slice(0, i)
        .reduce((total, s) => total + (s.delay * 60 * 1000), 0);

      const job = await emailQueue.add(
        `pipeline-${pipelineId}-step-${i}`,
        {
          recipients,
          templateId: step.templateId,
          stepIndex: i,
          pipelineId,
        },
        {
          delay: cumulativeDelay,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        }
      );

      scheduledJobs.push({
        stepIndex: i,
        jobId: job.id,
        scheduledFor: new Date(Date.now() + cumulativeDelay),
      });
    }

    return res.status(200).json({
      message: "Email pipeline scheduled successfully",
      pipelineId,
      totalSteps: steps.length,
      totalRecipients: recipients.length,
      scheduledJobs,
    });

  } catch (error) {
    console.error("Error scheduling email pipeline:", error);
    return res.status(500).json({ 
      error: "Failed to schedule email pipeline",
      details: error.message 
    });
  }
});

// Get queue status
mailRouter.get("/queue-status", async (req, res) => {
  try {
    const waiting = await emailQueue.getWaiting();
    const active = await emailQueue.getActive();
    const completed = await emailQueue.getCompleted();
    const failed = await emailQueue.getFailed();

    return res.status(200).json({
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get queue status" });
  }
});

// Clear all jobs (for testing)
mailRouter.delete("/clear-queue", async (req, res) => {
  try {
    await emailQueue.clear();
    return res.status(200).json({ message: "Queue cleared successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to clear queue" });
  }
});

