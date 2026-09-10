import { Length, IsEmail, IsString } from 'class-validator';
export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 16)
  password: string;
}
