import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    const userId = 1;
    return this.usersService.update(userId, updateUserDto);
  }

  @Get()
  findUser() {
    const userId = 1;
    return this.usersService.findOne(userId);
  }

}
