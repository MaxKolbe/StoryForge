import { Module } from '@nestjs/common';
import { AppController } from './modules/app/app.controller.js';
import { AppService } from './modules/app/app.service.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
