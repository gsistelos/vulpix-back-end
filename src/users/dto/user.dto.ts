import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto extends OmitType(User, ['password'] as const) {}
