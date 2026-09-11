import { Injectable } from '@nestjs/common';
import { stories } from '../../database/schemas/stories.js';
import { OpenAiService } from '../ai/ai.service.js';
import { Database } from '../../config/db.config.js';
import { CreateStory } from './dto/story.dto.js';
import type { Request } from 'express';

@Injectable()
export class StoryService {
  constructor(
    private readonly appdb: Database,
    private readonly client: OpenAiService,
  ) {}

  async createStory(body: CreateStory, req: Request) {
    const db = this.appdb.exec();

    const output_text = await this.client.createStory(
      body.topic,
      body.characters,
    );

    const [newStory] = await db
      .insert(stories)
      .values({
        userId: req.user!.id,
        fullContent: output_text,
      })
      .returning();
    const { fullContent: _fullContent, ...story } = newStory;

    return {
      success: true,
      message: 'new story created successfully',
      data: { preview: `${_fullContent.slice(0, 250)}...`, ...story },
      meta: null,
    };
  }
}
