import { Router } from "express";
import { sendBulkMail } from "../utils/sendBulkMail.js";

export const mailRouter = Router()

mailRouter.post('/send-emails', async (req, res) => {
  try {
    const {recipients, subject, htmlContent} = req.body
    const status = await sendBulkMail(recipients, subject, htmlContent)
    if(!status) throw new Error("Error sending mails")
    return res.status(200).json({message: "Emails sent"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error})
  }
  
})