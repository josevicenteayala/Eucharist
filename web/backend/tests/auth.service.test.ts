import { AuthService } from '../src/services/auth.service';
import { UserModel } from '../src/models/postgres/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/postgres/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password_hash: 'hashed',
        first_name: 'Test',
        last_name: 'User',
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await AuthService.register({
        email: 'test@test.com',
        password_hash: 'password', // Note: service expects 'password_hash' property name for raw password in DTO currently, which is slightly confusing naming but matches implementation
        first_name: 'Test',
        last_name: 'User',
      });

      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ user: mockUser, token: 'token' });
    });

    it('should throw error if user already exists', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        AuthService.register({
          email: 'test@test.com',
          password_hash: 'password',
          first_name: 'Test',
          last_name: 'User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password_hash: 'hashed',
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await AuthService.login('test@test.com', 'password');

      expect(result).toEqual({ user: mockUser, token: 'token' });
    });

    it('should throw error on invalid credentials', async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.login('test@test.com', 'password')).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token successfully', () => {
      const mockPayload = {
        userId: '123',
        email: 'test@test.com',
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = AuthService.verifyToken('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.anything());
      expect(result).toEqual(mockPayload);
    });

    it('should throw AppError on invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });

      expect(() => AuthService.verifyToken('invalid-token')).toThrow('Invalid token');
    });

    it('should throw AppError on expired token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      expect(() => AuthService.verifyToken('expired-token')).toThrow('Invalid token');
    });
  });
});
