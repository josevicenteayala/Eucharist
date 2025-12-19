import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, CreateUserDTO, User } from '../models/postgres/User';
import { config } from '../config/env';
import logger from '../config/logger';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export class AuthService {
  private static saltRounds = 12;

  /**
   * Register a new user
   */
  static async register(userDto: CreateUserDTO): Promise<{ user: User; token: string }> {
    // 1. Check if user already exists
    const existingUser = await UserModel.findByEmail(userDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(userDto.password_hash, this.saltRounds);

    // 3. Create user
    const newUser = await UserModel.create({
      ...userDto,
      password_hash: hashedPassword,
    });

    // 4. Generate token
    const token = this.generateToken(newUser);

    // Remove password from returned object should be handled by controller, but safe here too for internal use
    return { user: newUser, token };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // 1. Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 3. Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Generate JWT
   */
  private static generateToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(
      payload,
      config.jwt.secret as any,
      {
        expiresIn: config.jwt.accessTokenExpiry,
      } as any
    );
  }

  /**
   * Verify JWT
   */
  static verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Invalid token');
    }
  }
}
