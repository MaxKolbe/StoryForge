import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { jwtConstants } from './constants/constants.js';
import { PasswordService } from './password.service.js';
import { AuthController } from './auth.controller.js';
import { Database } from '../../config/db.config.js';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Database,
    LocalStrategy,
    JwtStrategy,
    PasswordService,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
