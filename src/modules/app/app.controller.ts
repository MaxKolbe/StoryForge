import {
  Get,
  Req,
  Param,
  Controller,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  ServiceUnavailableException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/v1')
  getHome() {
    return {
      success: true,
      message: 'Welcome to StoryForge',
    }
  }

  @Get('*')
  getWildCard(
    @Req() request: Request,
  ) {
    return{
      success: false,
      error: { code: 'NOT_FOUND', message: `Route ${request.path} not found` },
    };
  }

  @Get('errors/:id')
  getErrorResponses(@Param('id') id: string) {
    switch (id) {
      case '400':
        throw new BadRequestException();
      case '401':
        throw new UnauthorizedException();
      case '403':
        throw new ForbiddenException();
      case '404':
        throw new NotFoundException();
      case '409':
        throw new ConflictException();
      case '500':
        throw new InternalServerErrorException();
      case '503':
        throw new ServiceUnavailableException();
    }
  }
}
