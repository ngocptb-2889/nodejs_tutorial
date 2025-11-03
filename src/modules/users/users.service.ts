import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { HASH_LENGTH } from 'src/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from '../upload/upload.service';
import { I18nService } from 'nestjs-i18n';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private uploadService: UploadService,
    private readonly i18n: I18nService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | null> {
    return this.repo.findOne({ where: { id: userId } });
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

  async findOrFail(userId: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(this.i18n.translate('app.user.notFound'));
    }
    return user;
  }

  async updateUser(
    userId: number,
    updateDto: Partial<UpdateUserDto>,
    req: any,
    file?: Express.Multer.File
  ): Promise<{ user: UserResponseDto }> {
    const user = await this.findOrFail(userId);

    if (file) {
      try {
        if (user.image) {
          await this.uploadService.deleteImage(user.image);
        }

        const imageUrl = await this.uploadService.uploadImage(file);
        updateDto.image = imageUrl;
      } catch (error) {
        throw new InternalServerErrorException(this.i18n.translate('validation.uploadFileFail'));
      }
    }

    Object.assign(user, updateDto);

    const updatedUser = await this.repo.save(user);

    return this.getCurrentUser(updatedUser, req);
  }

  getCurrentUser(user: any, req: any): { user: UserResponseDto } {
    return {
      user: {
        email: user.email,
        token: req.headers.authorization?.replace('Bearer ', '') || null,
        username: user.username,
        bio: user.bio,
        image: user.image ?? null,
      },
    };
  }

  async resetPassword(userId: number, newPassword: string): Promise<{ message: string }> {
    try {
      const user = await this.findOrFail(userId);
      const hashedPassword = await bcrypt.hash(newPassword, HASH_LENGTH);
      user.password = hashedPassword;
      await this.repo.save(user);

      return {
        "message": this.i18n.translate('app.message.success.resetPassword')
      };
    } catch (error) {
      throw new InternalServerErrorException(this.i18n.translate('app.message.error.resetPassword'));
    }
  }
}
