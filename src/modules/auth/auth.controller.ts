import { Post, Body, Req, Controller, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto.js';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUser: AuthDto) {
    return await this.authService.register(createUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
