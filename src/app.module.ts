import { Module } from '@nestjs/common';
import { AppController } from './modules/app/app.controller.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { AppService } from './modules/app/app.service.js';
import { AuthService } from './modules/auth/auth.service.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
