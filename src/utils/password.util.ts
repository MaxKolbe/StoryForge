import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

const Bcrypt = bcrypt
@Injectable()
export class PasswordService {
  private SALT_ROUND = 10;
  private bcrypt = Bcrypt 

  async hashPassword(plainText: string): Promise<string> {
    return await this.bcrypt.hash(plainText, this.SALT_ROUND);
  }

  async verifyPassword(plainText: string, hash: string): Promise<boolean> {
    return await this.bcrypt.compare(plainText, hash);
  }
}
