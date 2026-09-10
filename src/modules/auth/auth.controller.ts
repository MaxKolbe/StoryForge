import { Post, Body, Res, Controller } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto.js';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() createUser: AuthDto,
  ) {
    const result = await this.authService.register(createUser);
    response.status(200).json({
      success: true,
      message: 'user registered successfully',
      data: result,
      meta: null,
    });
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() createUser: AuthDto,
  ) {
    const result = await this.authService.login(createUser);
    response.status(200).json({
      success: true,
      message: 'user logged in successfully',
      data: result.user,
      meta: {
        token: result.token
      },
    });
  }
}
