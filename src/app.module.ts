import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './modules/app/app.controller.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { AppService } from './modules/app/app.service.js';
import { AuthService } from './modules/auth/auth.service.js';
import { AuthEventsListener } from './events/listeners/auth.events.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      verboseMemoryLeak: false,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, AuthEventsListener],
})
export class AppModule {}
