import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import dotenv from 'dotenv'
dotenv.config()

const ses = new SESClient({
    region: process.env.AWS_REGION, 
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});


export async function sendBulkMail(toAddresses, subject, htmlContent) {

  const params = {
    Destination: {
      ToAddresses: ["shubhrathod192@gmail.com", "shubhamcodes7@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Data: htmlContent,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: process.env.AWS_SENDER_MAIL,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await ses.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return true
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

