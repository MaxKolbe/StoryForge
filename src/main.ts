import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { connectDatabase } from './config/db.config.js';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  await connectDatabase();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    routeResolutionStrategy: 'specificity',
  }); 
  await app.listen(process.env.PORT ?? 3000);
} 

await bootstrap();
