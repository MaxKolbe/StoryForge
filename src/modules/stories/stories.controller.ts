import { Get, Req, Post, Body, Controller, UseGuards } from '@nestjs/common';
import { CreateStory } from './dto/story.dto.js';
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

  @Get()
  listStories() {
    return;
  }

  @Get('id/checkout')
  storyCheckout() {
    return;
  }
}
