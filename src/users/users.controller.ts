import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { hashPassword } from 'src/lib/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = hashPassword(createUserDto.password);

    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    if (updateUserDto.password) {
      updateUserDto.password = hashPassword(updateUserDto.password);
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    return this.usersService.remove(id);
  }
}
