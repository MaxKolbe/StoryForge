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
import { LocalStrategy } from './modules/auth/strategies/local.strategy.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/auth/constants/constants.js';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy.js';
import { PasswordService } from './utils/password.util.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      verboseMemoryLeak: false,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    AuthEventsListener,
    SendEmail,
    Database,
    LocalStrategy,
    JwtStrategy,
    PasswordService,
  ],
})
export class AppModule {}
