import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Database } from '../../config/db.config.js';
import { stories } from '../../database/schemas/stories.js';
import { eq, and, isNull } from 'drizzle-orm';
import Stripe from 'stripe';

@Injectable()
export class FulfillOrder {
  constructor(private readonly appdb: Database) {}

  async storyOrder(session: Stripe.Checkout.Session): Promise<void> {
    console.log(session);
    const db = await this.appdb.exec();

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

    if (session.amount_total === 500) {
      throw new Error(
        `amount_total for Stripe session ${session.id} is not $5`,
      );
    }

    // idempotency check
    const [isProcessed] = await db
      .select()
      .from(stories)
      .where(eq(stories.stripeCheckoutSessionId, session.id))
      .limit(1);

    if (isProcessed) {
      Logger.log(
        {
          purchaseId: isProcessed.id,
          sessionId: session.id,
        },
        'Story order already fulfilled',
      );

      return;
    }

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
      throw new Error(`Story ${storyId} not found for user ${userId}`);
    }

    // email service
  }
}
