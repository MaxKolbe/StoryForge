import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthDto } from '../dto/auth.dto.js';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = plainToInstance(AuthDto, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      const messages = errors.flatMap((err) =>
        Object.values(err.constraints || {}),
      );
      throw new BadRequestException(messages);
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
