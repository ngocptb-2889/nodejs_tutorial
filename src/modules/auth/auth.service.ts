import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly i18n: I18nService
  ) {}

  async signup(input: SignupDto) {
    const existingEmail = await this.usersService.findByEmail(input.email);
    if (existingEmail) {
      throw new UnauthorizedException(this.i18n.translate('app.validation.emailAlreadyExists'));
    }

    const user = await this.usersService.create(input);

    return this.buildAuthResponse(user);
  }

  async login(input: LoginDto) {
    const { email, password } = input;
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(this.i18n.translate('app.validation.invalidCredentials'));
    }

    return this.buildAuthResponse(user);
  }


  private buildAuthResponse(user: any) {
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      email: user.email,
      username: user.username,
      bio: user.bio || null,
      image: user.image || null,
      token: token,
    };
  }
}
