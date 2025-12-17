import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDTO, UserModel, User } from '../models/postgres/User';
import { config } from '../config/env';

import { AppError } from '../utils/AppError';

export class AuthService {
  async register(data: CreateUserDTO): Promise<{ user: User; token: string }> {
    // 1. Check if user exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password_hash, saltRounds);

    // 3. Create user
    const newUser = await UserModel.create({
      ...data,
      password_hash: hashedPassword,
    });

    // 4. Generate token
    const token = this.generateToken(newUser);

    return { user: newUser, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // 1. Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // 3. Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry as any,
    });
  }
}

export const authService = new AuthService();
