import { postgresDb } from '../../config/database/postgres';
import logger from '../../config/logger';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export class UserModel {
  private static tableName = 'users';

  static async initializeTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await postgresDb.query(query);
      logger.info(`✅ Table ${this.tableName} initialized`);
    } catch (error) {
      logger.error(`❌ Failed to initialize table ${this.tableName}:`, error);
      throw error;
    }
  }

  static async create(user: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO ${this.tableName} (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user.email, user.password_hash, user.first_name, user.last_name];

    try {
      const result = (await postgresDb.query(query, values)) as { rows: User[] };
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1;`;

    try {
      const result = (await postgresDb.query(query, [email])) as { rows: User[] };
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1;`;

    try {
      const result = (await postgresDb.query(query, [id])) as { rows: User[] };
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }
}
