import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { stories } from '../../database/schemas/stories.js';
import { OpenAiService } from '../ai/ai.service.js';
import { Database } from '../../config/db.config.js';
import { CreateStory, ListStories } from './dto/story.dto.js';
import type { Request } from 'express';
import { asc, desc, count, eq, and } from 'drizzle-orm';
import { GlobalReturn } from '../../types/global.js';
import { CreateSession } from '../payments/payments.service.js';
import { story_price } from '../payments/constants/constants.js';
import { LineItem } from '../../types/payment.js';

@Injectable()
export class StoryService {
  constructor(
    private readonly appdb: Database,
    private readonly client: OpenAiService,
    private readonly session: CreateSession,
  ) {}

  async createStory(body: CreateStory, req: Request): Promise<GlobalReturn> {
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
      db
        .select({ count: count() })
        .from(stories)
        .where(eq(stories.userId, req.user!.id)),
    ]);

    const totalPages = Math.ceil(totalRecords!.count / limit);
    const allStories = data.map((story) => {
      const { fullContent: _fullContent, ...remainingContent } = story;
      return {
        preview: `${_fullContent.slice(0, 250)}...`,
        ...remainingContent,
      };
    });

    return {
      success: true,
      message: 'stories retrieved successfully',
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

  async getStory(id: string, req: Request): Promise<GlobalReturn> {
    const db = this.appdb.exec();

    const [data] = await db
      .select()
      .from(stories)
      .where(and(eq(stories.id, id), eq(stories.userId, req.user!.id)));

    if (!data) {
      throw new NotFoundException(`Story ${id} not found`);
    }

    const { fullContent: content, ...rest } = data;
    const story = data.isUnlocked
      ? data
      : { preview: `${content.slice(0, 250)}...`, ...rest };

    return {
      success: true,
      message: `story ${id} found successfully`,
      data: story,
      meta: null,
    };
  }

  async checkoutStory(id: string, req: Request): Promise<GlobalReturn> {
    const db = this.appdb.exec();
    const [story] = await db
      .select({ id: stories.id, isUnlocked: stories.isUnlocked })
      .from(stories)
      .where(and(eq(stories.id, id), eq(stories.userId, req.user!.id)));

    if (!story) {
      throw new NotFoundException(`Story ${id} not found`);
    }

    if (story.isUnlocked === true) {
      throw new ConflictException(`Story ${id} is already unlocked`);
    }

    const lineItem: LineItem = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `StoryForge Story #${story.id.split('-')[0]}`,
            description: 'StoryForge Story',
          },
          unit_amount: story_price,
        },
        quantity: 1,
      },
    ];

    const session = await this.session.storyCheckoutSession(
      lineItem,
      req.user!.email,
      req.user!.id,
      story.id,
    );

    return {
      success: true,
      message: 'story checkout session successfully',
      data: {
        url: session.url,
      },
      meta: null,
    };
  }
}
