import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hashPassword, verifyPassword } from '../../utils/password.util.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../../events/auth.events.js';
import { generateToken } from '../../utils/token.js';
import { AuthDto } from './dto/auth.dto.js';
import { Database } from '../../config/db.config.js';
import { users } from '../../database/schemas/users.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appdb: Database,
  ) {}

  async register(body: AuthDto) {
    const db = this.appdb.exec();
    const { email, password } = body;
    const hashedPassword = await hashPassword(password);

    const [oguser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (oguser) {
      throw new ConflictException('User already exists!');
    }

    const [newUser] = await db
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
    const db = this.appdb.exec();
    const { email, password } = body;

    const [user] = await db
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
