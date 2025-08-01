import { Router } from "express";
import { sendBulkMail } from "../utils/sendBulkMail.js";

export const mailRouter = Router();

mailRouter.post("/send-emails", async (req, res) => {
  try {
    const { recipients, subject, htmlContent } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res
        .status(400)
        .json({ error: "Recipients array is required and cannot be empty" });
    }
    if (!subject || typeof subject !== "string") {
      return res
        .status(400)
        .json({ error: "Subject is required and must be a string" });
    }
    if (!htmlContent || typeof htmlContent !== "string") {
      return res
        .status(400)
        .json({ error: "HTML content is required and must be a string" });
    }

    await sendBulkMail(recipients, subject, htmlContent);
    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Failed to send emails:", error?.message || error);
    return res
      .status(500)
      .json({ error: "Failed to send emails. Please try again later." });
  }
});
