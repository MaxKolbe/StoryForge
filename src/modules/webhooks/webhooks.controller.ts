import {
  Req,
  Post,
  Controller,
  type RawBodyRequest,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpCode
} from '@nestjs/common';
import { env } from '../../config/env.validation.js';
import type { Request } from 'express';
import Stripe from 'stripe';
import { FulfillOrder } from './webhooks.service.js';

@Controller('webhooks')
export class WebhookController {
  private readonly stripe = new Stripe(env.STRIPE_SECRET_KEY);

  constructor(private readonly fulfillorder: FulfillOrder) {}

  @HttpCode(200)
  @Post('stripe')
  async stripeWebhookController(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'];

    if (typeof signature !== 'string') {
      throw new BadRequestException('Missing Stripe signature');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing webhook body');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      Logger.error({ error }, 'Stripe webhook signature verification failed');

      throw new BadRequestException('Invalid webhook signature');
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          await this.fulfillorder.storyOrder(session);
          break;
        }

        default:
          Logger.log(
            { eventType: event.type },
            'Unhandled Stripe webhook event',
          );
      }

      return { received: true };
    } catch (error) {
      Logger.error(
        {
          eventId: event.id,
          error,
        },
        'Stripe webhook processing failed',
      );

      throw new InternalServerErrorException('Webhook processing failed');
    }
  }
}
