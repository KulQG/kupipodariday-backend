import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.UserRepository.save(createUserDto);
  }

  async findMany(search: { query: string }) {
    let users: User[];

    users = await this.UserRepository.find({
      where: { email: search.query },
    });

    if (users.length < 1) {
      users = await this.UserRepository.find({
        where: { username: search.query },
      });
    }

    return users;
  }

  async findWishes(username: string) {
    const user = await this.UserRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });

    return user.wishes;
  }

  findOne(id: number): Promise<User> {
    return this.UserRepository.findOneBy({ id });
  }

  findByUsername(username: string): Promise<User> {
    return this.UserRepository.findOne({
      where: { username },
      relations: {
        wishes: true,
        offers: true,
        wishlists: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.UserRepository.update(id, {
        password: hashedPassword,
        ...rest,
      });
    } else {
      await this.UserRepository.update(id, rest);
    }
  }

  remove(id: number, userId) {
    if (userId === id) {
      return this.UserRepository.delete({ id });
    } else {
      throw new ForbiddenException();
    }
  }
}
