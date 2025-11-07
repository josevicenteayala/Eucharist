import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../src/middleware/errors';

describe('Custom Error Classes', () => {
  describe('ApiError', () => {
    it('should create an error with all properties', () => {
      const error = new ApiError('Test message', 400, 'TEST_CODE', { field: 'test' });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('Test message');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ field: 'test' });
      expect(error.name).toBe('ApiError');
      expect(error.stack).toBeDefined();
    });

    it('should create an error without details', () => {
      const error = new ApiError('Test message', 500, 'ERROR_CODE');

      expect(error.statusCode).toBe(500);
      expect(error.details).toBeUndefined();
    });
  });

  describe('ValidationError', () => {
    it('should create a 400 validation error with default message', () => {
      const error = new ValidationError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Validation failed');
    });

    it('should create a validation error with custom message and details', () => {
      const details = [{ field: 'email', message: 'Invalid email format' }];
      const error = new ValidationError('Invalid input data', details);

      expect(error.message).toBe('Invalid input data');
      expect(error.details).toEqual(details);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create a 401 unauthorized error with default message', () => {
      const error = new UnauthorizedError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toBe('Authentication required');
    });

    it('should create an unauthorized error with custom message', () => {
      const error = new UnauthorizedError('Invalid token');

      expect(error.message).toBe('Invalid token');
    });
  });

  describe('ForbiddenError', () => {
    it('should create a 403 forbidden error with default message', () => {
      const error = new ForbiddenError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
      expect(error.message).toBe('Access forbidden');
    });

    it('should create a forbidden error with custom message', () => {
      const error = new ForbiddenError('Insufficient permissions');

      expect(error.message).toBe('Insufficient permissions');
    });
  });

  describe('NotFoundError', () => {
    it('should create a 404 not found error with default resource', () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Resource not found');
    });

    it('should create a not found error with custom resource name', () => {
      const error = new NotFoundError('User');

      expect(error.message).toBe('User not found');
    });
  });

  describe('ConflictError', () => {
    it('should create a 409 conflict error with default message', () => {
      const error = new ConflictError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
      expect(error.message).toBe('Resource already exists');
    });

    it('should create a conflict error with custom message and details', () => {
      const error = new ConflictError('Email already registered', { email: 'test@example.com' });

      expect(error.message).toBe('Email already registered');
      expect(error.details).toEqual({ email: 'test@example.com' });
    });
  });

  describe('InternalServerError', () => {
    it('should create a 500 internal server error with default message', () => {
      const error = new InternalServerError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.message).toBe('Internal server error');
    });

    it('should create an internal server error with custom message and details', () => {
      const error = new InternalServerError('Database connection failed', { db: 'postgres' });

      expect(error.message).toBe('Database connection failed');
      expect(error.details).toEqual({ db: 'postgres' });
    });
  });
});
