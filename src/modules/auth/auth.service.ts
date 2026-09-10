import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPassword, verifyPassword } from '../../utils/password.util.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../../events/events.js';
import { generateToken } from '../../utils/token.js';
import { AuthDto } from './dto/auth.dto.js';
import { db } from '../../config/db.config.js';
import { users } from '../../database/schemas/users.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  private readonly appdb = db;

  constructor(private eventEmitter: EventEmitter2) {}

  async register(body: AuthDto) {
    const { email, password } = body;
    const hashedPassword = await hashPassword(password);

    
    const [newUser] = await this.appdb
        .insert(users)
        .values({
          email,
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          email: users.email,
          createdAt: users.createdAt,
        });
    

    // Event Emitter
    this.eventEmitter.emit(
      'auth.user-registered',
      new UserRegisteredEvent({
        userId: newUser.id,
        email: newUser.email,
      }),
    );

    return newUser;
  }

  async login(body: AuthDto) {
    const { email, password } = body;

    const [user] = await this.appdb
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email,
    });

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      token,
    };
  }
}
