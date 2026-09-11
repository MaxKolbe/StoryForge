import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './modules/app/app.controller.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { AppService } from './modules/app/app.service.js';
import { AuthService } from './modules/auth/auth.service.js';
import { AuthEventsListener } from './events/listeners/auth.listener.js';
import { SendEmail } from './modules/emails/email.service.js';
import { Database } from './config/db.config.js';
import { LocalStrategy } from './modules/auth/local.strategy.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      verboseMemoryLeak: false,
    }),
    PassportModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    AuthEventsListener,
    SendEmail,
    Database,
    LocalStrategy,
  ],
})
export class AppModule {}
