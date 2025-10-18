import { Put, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Logger } from '@nestjs/common';
@Controller('users') // => /users // controller 
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() { 
    this.logger.log('Getting all users'); // Log khi bắt đầu
    const users = this.usersService.findAll();
    //this.logger.log(`Retrieved ${users.length} users`); // Log khi hoàn thành
    return users;
}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
