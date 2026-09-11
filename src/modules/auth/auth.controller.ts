import { Post, Body, Controller } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto.js';
import { AuthService } from './auth.service.js';
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUser: AuthDto,
  ) {
    return await this.authService.register(createUser);
  }

  @Post('login')
  async login(
    @Body() createUser: AuthDto,
  ) {
    return await this.authService.login(createUser);
  }
} 
