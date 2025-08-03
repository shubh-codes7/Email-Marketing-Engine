//this was for testing purpose only

import dotenv from "dotenv";
dotenv.config();

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function sendEmail() {
  const params = {
    Destination: {
      ToAddresses: ["shubhrathod192@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: "This is a test email sent using AWS SES in Node.js!",
        },
      },
      Subject: {
        Data: "Test Email from SES",
      },
    },
    Source: process.env.AWS_SENDER_MAIL,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await ses.send(command);
    console.log("Email sent successfully:", response.MessageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendEmail();
