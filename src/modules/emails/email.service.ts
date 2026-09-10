import ejs from 'ejs';
import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../config/env.validation.js';
import { BrevoClient, BrevoError } from '@getbrevo/brevo';

const brevoClient = new BrevoClient({ apiKey: env.BREVO_API_KEY.toString() });

@Injectable()
export class SendEmail {
  private readonly brevo = brevoClient;

  async sendEmail(
    to: string,
    subject: string,
    content: string,
    name: string = 'StoryForge',
  ): Promise<{
    messageId?: string | undefined;
    messageIds?: string[] | undefined;
  }> {
    let html = await ejs.renderFile(
      process.cwd() + '/views/template.ejs',
      { subject: subject, title: subject, content: content },
      { async: true },
    );

    try {
      const result = await this.brevo.transactionalEmails.sendTransacEmail({
        subject: subject,
        htmlContent: html,
        sender: { name: name, email: env.BREVO_EMAIL.toString() },
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
  }
}
