import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(120)
  password: string;
}
