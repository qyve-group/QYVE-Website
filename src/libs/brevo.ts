// libs/brevoClient.ts
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";

// Create a reusable Brevo client
const brevoClient = new TransactionalEmailsApi();

// ✅ Correct enum usage instead of raw string
brevoClient.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export { brevoClient, SendSmtpEmail };
