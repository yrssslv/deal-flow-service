import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const result = { ...user };
    delete (result as Partial<User>).password;
    return result as Omit<User, 'password'>;
  }

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return this.excludePassword(user);
  }

  async validateUser(dto: LoginDto): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      return null;
    }

    return this.excludePassword(user);
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
