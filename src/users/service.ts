import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()  // ~ @Service trong Spring
export class UsersService {
  
  constructor(
    @InjectRepository(User)  // ~ @Autowired UserRepository
    private userRepo: Repository<User>,  // ~ JpaRepository<User, Long>
  ) {}

  // GET ALL - giống findAll() trong Spring Data JPA
  findAll() {
    return this.userRepo.find();  // ~ userRepository.findAll()
  }

  // GET BY ID - giống findById() trong Spring
  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id }); // ~ findById(id)
    if (!user) throw new NotFoundException('User not found'); // ~ throw new ResourceNotFoundException()
    return user;
  }

  // CREATE - giống save() trong Spring
  create(dto: CreateUserDto) {  // DTO ~ Request DTO trong Spring
    const newUser = this.userRepo.create(dto); // ~ new User(dto)
    return this.userRepo.save(newUser); // ~ userRepository.save(user)
  }

  // UPDATE - giống save() với ID có sẵn
  async update(id: number, dto: UpdateUserDto) {
    await this.userRepo.update(id, dto); // ~ userRepository.save(existingUser)
    return this.findOne(id); // return updated user
  }

  // DELETE - giống deleteById() trong Spring
  async remove(id: number) {
    const user = await this.findOne(id); // ~ findById trước
    return this.userRepo.remove(user); // ~ delete(user)
  }
}