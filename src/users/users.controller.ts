import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { hashPassword } from 'src/lib/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already in use' })
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = hashPassword(createUserDto.password);

    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved',
    type: [UserDto],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No users found' })
  async findAll() {
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated',
    type: UserDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You are not allowed to update this user',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already in use' })
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
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You are not allowed to delete this user',
  })
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    return this.usersService.remove(id);
  }
}
