import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @MinLength(8)
  @MaxLength(120)
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;
}
