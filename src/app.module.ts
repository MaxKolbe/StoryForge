import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './modules/app/app.controller.js';
import { AuthEventsListener } from './events/listeners/auth.listener.js';
import { SendEmail } from './modules/emails/email.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AppService } from './modules/app/app.service.js';
import { StoryModule } from './modules/stories/stories.module.js';
@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      verboseMemoryLeak: false,
    }),
    AuthModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthEventsListener, SendEmail],
})
export class AppModule {}
