import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, CreateUserDTO, User } from '../models/postgres/User';
import { config } from '../config/env';
import logger from '../config/logger';
import { AppError } from '../utils/AppError';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export class AuthService {
  private static saltRounds: number = (() => {
    const envValue = process.env.BCRYPT_SALT_ROUNDS;
    if (envValue !== undefined) {
      const parsed = Number.parseInt(envValue, 10);
      if (!Number.isNaN(parsed) && parsed >= 12) {
        return parsed;
      }
      logger.warn(
        `Invalid BCRYPT_SALT_ROUNDS value "${envValue}". Using default of 12 (must be an integer >= 12).`
      );
    }
    return 12;
  })();

  /**
   * Register a new user
   */
  static async register(userDto: CreateUserDTO): Promise<{ user: User; token: string }> {
    // 1. Check if user already exists
    const existingUser = await UserModel.findByEmail(userDto.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
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

    // Note: password_hash removal is handled by controller for API responses
    return { user: newUser, token };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // 1. Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
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

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT
   */
  static verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        const err = error as Error;
        logger.error('Token verification failed', {
          message: err.message,
          name: err.name,
        });
      } else {
        logger.error('Token verification failed:', error);
      }
      throw new AppError('Invalid token', 401);
    }
  }
}
