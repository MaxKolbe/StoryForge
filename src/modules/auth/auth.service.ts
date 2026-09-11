import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../utils/password.util.js';
import { UserRegisteredEvent } from '../../events/auth.events.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { users } from '../../database/schemas/users.js';
// import { generateToken } from '../../utils/token.js';
import { GlobalReturn } from '../../types/global.js';
import { Database } from '../../config/db.config.js';
import { AuthDto } from './dto/auth.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly appdb: Database,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}

  async register(body: AuthDto): Promise<GlobalReturn> {
    const db = this.appdb.exec();
    const { email, password } = body;
    const hashedPassword = await this.passwordService.hashPassword(password);

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

    return {
      success: true,
      message: 'user registered successfully',
      data: newUser,
      meta: null,
    };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(body: AuthDto): Promise<any> {
    const db = this.appdb.exec();
    const { email, password } = body;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user && (await this.passwordService.verifyPassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
