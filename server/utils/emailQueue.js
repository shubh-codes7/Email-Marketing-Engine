import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { sendBulkMail } from "./sendBulkMail.js";
import Template from '../models/EmailTemplate.model.js';

// Redis connection for BullMQ with proper configuration
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
});

// Create email queue
export const emailQueue = new Queue("email-queue", {
  connection: redis,
});

// Email job processor
export const emailWorker = new Worker("email-queue", async (job) => {
  const { recipients, templateId, stepIndex, pipelineId } = job.data;
  
  try {
    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Send emails
    const result = await sendBulkMail(
      recipients,
      template.subject,
      template.htmlContent
    );

    console.log(`Step ${stepIndex} completed for pipeline ${pipelineId}`);
    return { success: true, stepIndex, pipelineId };
  } catch (error) {
    console.error(`Error processing step ${stepIndex} for pipeline ${pipelineId}:`, error);
    throw error;
  }
}, {
  connection: redis,
  concurrency: 5 // Process 5 jobs concurrently
});

// Handle worker events
emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed for step ${job.data.stepIndex}`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed for step ${job.data.stepIndex}:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await emailWorker.close();
  await emailQueue.close();
  await redis.quit();
});

process.on('SIGINT', async () => {
  await emailWorker.close();
  await emailQueue.close();
  await redis.quit();
}); 