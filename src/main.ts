import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { env } from './config/env.validation.js';
import { logger } from './config/logger.config.js';
import { Database } from './config/db.config.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    routeResolutionStrategy: 'specificity',
  });

  app.useLogger(new logger());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(process.cwd(), '/public'));
  app.setBaseViewsDir(join(process.cwd(), '/views'));
  app.setViewEngine('ejs');

  const db = new Database();
  await db.connect()
  await app.listen(env.PORT ?? 3000);
}

await bootstrap();
