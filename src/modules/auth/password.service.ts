import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  private SALT_ROUND = 10;

  async hashPassword(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.SALT_ROUND);
  }

  async verifyPassword(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
