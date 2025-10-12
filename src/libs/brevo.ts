// libs/brevoClient.ts
import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  // TODO: module not found @getbrevo/brevo
} from '@getbrevo/brevo';

// Create a reusable Brevo client
const brevoClient = new TransactionalEmailsApi();

// ✅ Correct enum usage instead of raw string
brevoClient.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string,
);

export { brevoClient, SendSmtpEmail };
