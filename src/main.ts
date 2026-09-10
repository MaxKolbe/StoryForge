import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { env } from "./config/env.validation.js";
import { logger } from './config/logger.config.js';
import { connectDatabase } from './config/db.config.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    routeResolutionStrategy: 'specificity',
  });

  app.useLogger(new logger());
  app.useStaticAssets(join(process.cwd(), "/public"));
  app.setBaseViewsDir(join(process.cwd(), "/views"));
  app.setViewEngine('ejs');

  await connectDatabase();
  await app.listen(env.PORT ?? 3000);
}

await bootstrap();
