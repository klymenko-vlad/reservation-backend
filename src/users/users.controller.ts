import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../database/schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // async findAll(): Promise<User[]> {
  //   return this.usersService.getAllUsers();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<User> {
  //   return await this.usersService.getUserById(id);
  // }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User) {
    const { role } = await this.usersService.getUserWithRole(user.id);
    const retrievedUser = await this.usersService.getUserById(user.id);
    return {
      ...retrievedUser,
      role,
    };
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }
}
