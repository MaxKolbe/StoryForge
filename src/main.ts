import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { connectDatabase } from './config/db.config.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { env } from "./config/env.validation.js";
import { logger } from './config/logger.config.js';

async function bootstrap() {
  await connectDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    routeResolutionStrategy: 'specificity',
  });
  app.useLogger(new logger());
  await app.listen(env.PORT ?? 3000);
}

await bootstrap();
