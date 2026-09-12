import { Injectable } from '@nestjs/common';
import { stories } from '../../database/schemas/stories.js';
import { OpenAiService } from '../ai/ai.service.js';
import { Database } from '../../config/db.config.js';
import { CreateStory, ListStories } from './dto/story.dto.js';
import type { Request } from 'express';
import { asc, desc, count, eq } from 'drizzle-orm';
import { GlobalReturn } from '../../types/global.js';

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

  async listStories(query: ListStories, req: Request): Promise<GlobalReturn> {
    const db = this.appdb.exec();
    const { page, limit, orderBy } = query;
    const offset = (page - 1) * limit;

    const sortOrder =
      orderBy === 'asc' ? asc(stories.createdAt) : desc(stories.createdAt);

    const [data, [totalRecords]] = await Promise.all([
      db
        .select({
          id: stories.id,
          userId: stories.userId,
          fullContent: stories.fullContent,
          isUnlocked: stories.isUnlocked,
          createdAt: stories.createdAt,
        })
        .from(stories)
        .where(eq(stories.userId, req.user!.id))
        .orderBy(sortOrder)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(stories),
    ]);

    const totalPages = Math.ceil(totalRecords!.count / limit);
    const allStories = data.map((story) => {
      const { fullContent: _fullContent, ...remainingContent } = story;
      return { preview: `${_fullContent.slice(0, 250)}...`, ...remainingContent };
    });

    return {
      success: true,
      message: 'products retrieved successfully',
      data: allStories,
      meta: {
        pagination: {
          page,
          limit,
          totalRecords: totalRecords!.count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  }
}
