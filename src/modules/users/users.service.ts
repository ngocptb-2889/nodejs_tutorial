import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { HASH_LENGTH } from 'src/common';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(input: SignupDto): Promise<User> {
    const hashed = await bcrypt.hash(input.password, HASH_LENGTH);
    const user = this.repo.create({
      email: input.email,
      username: input.username,
      password: hashed,
      bio: input.bio ?? undefined,
      image: input.image ?? undefined,
    });

    return this.repo.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch ? user : null;
  }
}
