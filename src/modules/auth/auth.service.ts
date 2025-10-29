import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(input: SignupDto) {
    const existingEmail = await this.usersService.findByEmail(input.email);
    if (existingEmail) {
      throw new UnauthorizedException('Email already in use');
    }

    const user = await this.usersService.create(input);

    return this.generateToken(user);
  }

  async login(input: LoginDto) {
    const {email, password} = input;
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
