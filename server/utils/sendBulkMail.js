import { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}


//send bulk mails function
export async function sendBulkMail(toAddresses, subject, htmlContent) {
  const emailList = toAddresses.map((user) => user.email);
  const batches = chunkArray(emailList, 2); // Max 50 emails per SES send

  for (const batch of batches) {
    const params = {
      Destination: {
        ToAddresses: emailList,
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
      console.log("Sent batch:", batch, "MessageId:", response.MessageId);
      return true;
    } catch (err) {
      console.error("Error sending batch:", batch, err);
    }
  }
}


//verify mails function
export async function verifyEmails(emailList) {
  const results = {
    verified: [],
    failed: [],
  };

  for (const email of emailList) {
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: email,
    });

    try {
      await ses.send(command);
      results.verified.push(email);
    } catch (err) {
      console.error(`Failed to verify: ${email}`, err.message);
      results.failed.push({ email, error: err.message });
    }
  }

  return results;
}
