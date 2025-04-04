import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';

export class User implements PrismaUser {
  @ApiProperty({ description: 'Unique identifier (CUID)' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ description: 'Hashed password' })
  password: string;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    required: false,
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  updatedAt: Date;
}
