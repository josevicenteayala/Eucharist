/**
 * Mock Data Factories
 *
 * Factory functions to generate consistent test data
 * for various entities in the application.
 */

/**
 * Generate a mock user object
 */
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: 'test-user-id-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light',
    },
    ...overrides,
  };
}

/**
 * Generate a mock gospel reading
 */
export function createMockGospel(overrides?: Partial<MockGospel>): MockGospel {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: 'gospel-id-123',
    date: today,
    reading: 'John 3:16',
    text: 'For God so loved the world...',
    reflection: 'Today we reflect on...',
    audioUrl: 'https://example.com/audio.mp3',
    ...overrides,
  };
}

/**
 * Generate a mock article
 */
export function createMockArticle(overrides?: Partial<MockArticle>): MockArticle {
  return {
    id: 'article-id-123',
    title: 'Understanding the Eucharist',
    slug: 'understanding-the-eucharist',
    category: 'eucharist-basics',
    content: '# Understanding the Eucharist\n\nContent here...',
    summary: 'An introduction to the Eucharist',
    author: 'Fr. John Doe',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['eucharist', 'basics'],
    theologicalReview: {
      reviewed: true,
      reviewedBy: 'Fr. John Doe',
      reviewDate: new Date().toISOString(),
      magisteriumRefs: ['CCC 1373-1377'],
    },
    ...overrides,
  };
}

/**
 * Generate a mock prayer intention
 */
export function createMockPrayerIntention(
  overrides?: Partial<MockPrayerIntention>
): MockPrayerIntention {
  return {
    id: 'intention-id-123',
    userId: 'user-id-123',
    text: 'For healing and peace',
    isPublic: true,
    isAnonymous: false,
    prayerCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate a mock error object
 */
export function createMockError(
  message: string = 'Test error',
  code: string = 'TEST_ERROR',
  statusCode: number = 400
): MockError {
  return {
    message,
    code,
    statusCode,
    details: {},
  };
}

/**
 * Generate mock database health status
 */
export function createMockDatabaseHealth(
  status: 'healthy' | 'unhealthy' | 'disconnected' = 'healthy'
): MockDatabaseHealth {
  return {
    status,
    message: status === 'healthy' ? 'Connected' : 'Not connected',
    timestamp: new Date().toISOString(),
    responseTime: status === 'healthy' ? 10 : undefined,
  };
}

/**
 * Generate array of mock items
 */
export function createMockArray<T>(factory: (index: number) => T, count: number): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}

// Type definitions for mock data
export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: {
    language: string;
    notifications: boolean;
    theme: string;
  };
}

export interface MockGospel {
  id: string;
  date: string;
  reading: string;
  text: string;
  reflection: string;
  audioUrl?: string;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  summary: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  theologicalReview: {
    reviewed: boolean;
    reviewedBy: string;
    reviewDate: string;
    magisteriumRefs: string[];
  };
}

export interface MockPrayerIntention {
  id: string;
  userId: string;
  text: string;
  isPublic: boolean;
  isAnonymous: boolean;
  prayerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockError {
  message: string;
  code: string;
  statusCode: number;
  details: Record<string, unknown>;
}

export interface MockDatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'disconnected';
  message: string;
  timestamp: string;
  responseTime?: number;
}
