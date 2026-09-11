import { Post, Body, Req, Controller, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUser: AuthDto) {
    return await this.authService.register(createUser);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    return req.user;
  }
  // async login(@Body() createUser: AuthDto) {
  //   return await this.authService.login(createUser);
  // }
}
