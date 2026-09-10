import ejs from 'ejs';
import { Logger } from '@nestjs/common';
import { env } from '../../config/env.validation.js';
import { BrevoClient, BrevoError } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: env.BREVO_API_KEY.toString() });

export const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  name: string = 'Mini Product Store',
): Promise<{
  messageId?: string | undefined;
  messageIds?: string[] | undefined;
}> => {
  let html = await ejs.renderFile(
    process.cwd() + '/views/template.ejs',
    { subject, title: subject, content },
    { async: true },
  );

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name, email: env.BREVO_EMAIL.toString() },
      to: [{ email: to }],
    });

    Logger.log(
      {
        messageId: result.messageId,
      },
      'Message sent successfully',
    );

    return result;
  } catch (error: any) {
    if (error.statusCode === 401) {
      Logger.error({ recipient: to }, 'Invalid API key:');
    } else if (error.statusCode === 429) {
      const retryAfter = error.rawResponse.headers['retry-after'];
      Logger.error(
        {
          recipient: to,
        },
        `Rate limited. Retry after ${retryAfter}s`,
      );
    } else if (error instanceof BrevoError) {
      Logger.error(
        {
          recipient: to,
          errorMessage: error.message,
        },
        `Brevo API error ${error.statusCode}`,
      );
    }

    throw error;
  }
};
