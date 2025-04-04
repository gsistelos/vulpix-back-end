import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'John Doe' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @MinLength(8)
  @MaxLength(120)
  @ApiProperty({ example: 'password123' })
  password: string;
}
