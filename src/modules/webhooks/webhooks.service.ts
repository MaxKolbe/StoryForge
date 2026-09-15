import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Database } from '../../config/db.config.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { stories } from '../../database/schemas/stories.js';
import { eq, and, isNull } from 'drizzle-orm';
import Stripe from 'stripe';
import { StoryPurchasedEvent } from '../../events/stories.events.js';
import { story_price } from '../payments/constants/constants.js';

@Injectable()
export class FulfillOrder {
  constructor(
    private readonly appdb: Database,
    private eventEmitter: EventEmitter2,
  ) {}

  async storyOrder(session: Stripe.Checkout.Session): Promise<void> {
    const db = this.appdb.exec();

    if (session.payment_status !== 'paid') {
      Logger.warn(
        {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        },
        'Checkout session completed without successful payment',
      );

      return;
    }

    const userId = session.metadata?.userId;
    const storyId = session.metadata?.storyId;

    if (!userId || !storyId) {
      throw new Error(`Missing metadata for Stripe session ${session.id}`);
    }

    if (session.amount_total !== story_price) {
      throw new Error(
        `amount_total for Stripe session ${session.id} is not $5`,
      );
    }

    // idempotency check
    const [updatedStory] = await db
      .update(stories)
      .set({
        isUnlocked: true,
        stripeCheckoutSessionId: session.id,
      })
      .where(
        and(
          eq(stories.id, storyId),
          eq(stories.userId, userId),
          isNull(stories.stripeCheckoutSessionId),
        ),
      )
      .returning();

    if (!updatedStory) {
      Logger.log({
        storyId,
        userId
      }, `Story not found or already fulfilled`);
      return;
    }

    // email event emitter service
    const email = session.metadata?.email;

    if (!email) {
      Logger.warn(
        {
          sessionId: session.id,
        },
        'Missing user email on checkout session',
      );
    } else {
      this.eventEmitter.emit(
        'story.user-purchased',
        new StoryPurchasedEvent({
          userId,
          storyId,
          email,
        }),
      );
    }

    Logger.log(
      {
        sessionId: session.id,
        userId,
        storyId,
      },
      'Story purchased  successfully',
    );
  }
}
