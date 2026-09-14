import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StoryPurchasedEvent } from '../stories.events.js';
import { SendEmail } from '../../modules/emails/email.service.js';
import ejs from 'ejs';
import { Database } from '../../config/db.config.js';
import { stories } from '../../database/schemas/stories.js';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class StoryEventsListener {
  constructor(
    private readonly email: SendEmail,
    private readonly appdb: Database,
  ) {}

  @OnEvent('story.user-purchased')
  async handleStoryPurchasedEvent(event: StoryPurchasedEvent): Promise<void> {
    Logger.log(event.payload.email, 'STORY PURCHASED EVENT RECEIVED');

    const db = await this.appdb.exec();

    try {
      const [story] = await db
        .select({ fullstory: stories.fullContent })
        .from(stories)
        .where(
          and(
            eq(stories.id, event.payload.storyId),
            eq(stories.userId, event.payload.userId),
          ),
        );

      if (!story) {
        throw new Error(
          `Story ${event.payload.storyId} not found for user ${event.payload.userId}`,
        );
      }

      const content = await ejs.renderFile(
        process.cwd() + '/views/fullstory.ejs',
        {
          name: event.payload.email.split('@')[0],
          storyId: event.payload.storyId,
          content: story.fullstory,
        },
        { async: true },
      );

      const maxAttempts = 2;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const info = await this.email.sendEmail(
            event.payload.email,
            `Here's your full story!`,
            content,
          );

          if (!info) {
            throw new Error('Email service returned no response');
          }

          Logger.log(
            {
              userId: event.payload.userId,
              attempt,
            },
            'Full story content email sent successfully',
          );

          break;
        } catch (error: unknown) {
          if (attempt < maxAttempts) {
            Logger.warn(
              {
                attempt,
                userId: event.payload.userId,
              },
              `Email send attempt ${attempt} failed, retrying...`,
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            throw error;
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      Logger.error(
        {
          email: event.payload.email,
          message,
        },
        'Failed to send full story content email',
      );
    }
  }
}
