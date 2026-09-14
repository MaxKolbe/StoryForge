import { Module } from '@nestjs/common';
import { Database } from '../../config/db.config.js';
import { FulfillOrder } from './webhooks.service.js';
import { WebhookController } from './webhooks.controller.js';

@Module({
  controllers: [WebhookController],
  providers: [Database, FulfillOrder],
})
export class WebhookModule {}
