import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events.js';
import { SendEmail } from '../../modules/emails/email.service.js';
import ejs from 'ejs';

@Injectable()
export class AuthEventsListener {
  constructor(private readonly email: SendEmail) {}

  @OnEvent('auth.user-registered')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    Logger.log(event.payload.email, 'USER REGISTERED EVENT RECEIVED');

    try {
      let content = await ejs.renderFile(
        process.cwd() + '/views/welcome.ejs',
        { name: event.payload.email.split('@')[0] },
        { async: true },
      );

      const info = await this.email.sendEmail(event.payload.email, 'Welcome!', content);

      if (!info) {
        throw new Error();
      }

      Logger.log(
        {
          message: 'new user registered successfully',
          userId: event.payload.userId,
          // correlationId: event.payload.correlationId,
        },
        'welcome email sent successully',
      );
    } catch (error: any) {
      Logger.error(
        {
          email: event.payload.email,
          message: error.message,
          // correlationId: event.payload.correlationId,
        },
        'Failed to send welcome email',
      );
    }
  }
}
