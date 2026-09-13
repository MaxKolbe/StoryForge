import { Injectable } from '@nestjs/common';
import { env } from '../../config/env.validation.js';
import { story_price } from './constants/constants.js';
import { Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class CreateSession {
  private readonly stripe = new Stripe(env.STRIPE_SECRET_KEY);

  async storyCheckoutSession(
    lineItems: any,
    userEmail: string,
    userId: string,
    storyId: string,
  ) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        customer_email: userEmail,
        success_url: `${env.API_BASE_URL}/api/v1/stories/checkout?success=true`,
        metadata: {
          userId,
          storyId,
        },
      });

      return session;
    } catch (error: unknown) {
      if (error instanceof this.stripe.errors.StripeError) {
        switch (error.type) {
          case 'StripeCardError':
            Logger.error(`declined card error for ${userEmail}`, {
              status: error.statusCode,
              code: error.code,
              message: error.message,
              requestId: error.requestId,
            });
            throw error;
          case 'StripeRateLimitError':
            Logger.error('Too many requests made to the API too quickly', {
              userEmail,
              requestId: error.requestId,
            });
            throw error;
          case 'StripeInvalidRequestError':
            Logger.error("Invalid parameters were supplied to Stripe's API", {
              message: error.message,
              requestId: error.requestId,
            });
            throw error;
          case 'StripeAPIError':
            Logger.error("An error occurred internally with Stripe's API", {
              requestId: error.requestId,
            });
            throw error;
          case 'StripeConnectionError':
            Logger.error(
              'Some kind of error occurred during the HTTPS communication',
              {
                requestId: error.requestId,
              },
            );
            throw error;
          case 'StripeAuthenticationError':
            Logger.error('StripeAuthenticationerror', {
              requestId: error.requestId,
              note: 'You probably used an incorrect API key',
            });
            throw error;
          default:
            Logger.error(`Stripe Error`, {
              status: error.statusCode,
              code: error.code,
              message: error.message,
              requestId: error.requestId,
            });
            throw error;
        }
      }
      throw error;
    }
  }
}
