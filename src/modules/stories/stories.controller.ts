import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Param,
  Controller,
  UseGuards,
  ParseUUIDPipe,
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getStory(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: Request) {
    return this.storyService.getStory(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/checkout')
  storyCheckout(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    return this.storyService.checkoutStory(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout/success')
  checkoutoNSuccess() {
    return 'Checkout Successful';
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkout/cancel')
  checkoutOnCancel() {
    return 'Checkout Cancelled';
  }
}
