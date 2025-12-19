import { User } from '../models/postgres/User';

/**
 * Remove sensitive data from user object before sending in response
 */
export const sanitizeUser = (user: User): Omit<User, 'password_hash'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...safeUser } = user;
  return safeUser;
};
