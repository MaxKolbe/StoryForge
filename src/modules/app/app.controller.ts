import {
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Request, Response } from 'express';

@Controller() // Decorator
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // response status code is 200
  getHello(): string {
    return this.appService.getHello();
  }

  @Post() // response status code is 201
  postHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @HttpCode(204) // response status code is 204
  postNoHello(): string {
    return this.appService.getHello();
  }

  @Post() // use both nest default return + express's response object
  findall(@Res({ passthrough: true }) response: Response) {
    response.status(200).send('Hello world');
  }

  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }

  // Notes: @Body(), @Query(), @Param(), and @RawBody() can also accept an options object with schema and pipes.

  // @Post()
  // create(@Body({ schema: createCatSchema }) createCatDto: CreateCatDto) {
  //   return this.catsService.create(createCatDto);
  // }

  // @Get(':id')
  // findOne(
  //   @Param('id', { schema: z.coerce.number().int().positive() }) id: number,
  // ) {
  //   return this.catsService.findOne(id);
  // }
}
