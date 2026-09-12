import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { CreateStory, ListStories } from './dto/story.dto.js';
import { StoryService } from './stories.service.js';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
@Controller('api/v1/stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createStory(@Body() createStory: CreateStory, @Req() req: Request) {
    return this.storyService.createStory(createStory, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listStories(@Query() query: ListStories, @Req() req: Request) {
    return this.storyService.listStories(query, req);
  }

  @Get('id/checkout')
  storyCheckout() {
    return;
  }
}
