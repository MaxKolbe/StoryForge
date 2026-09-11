import { Module } from '@nestjs/common';
import { StoryService } from './stories.service.js';
import { StoryController } from './stories.controller.js';
import { Database } from '../../config/db.config.js';
import { OpenAiService } from '../ai/ai.service.js';
import { AuthModule } from '../auth/auth.module.js';
@Module({
  imports: [AuthModule],
  controllers: [StoryController],
  providers: [Database, StoryService, OpenAiService],
})

export class StoryModule {}
