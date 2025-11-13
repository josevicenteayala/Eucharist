/* eslint-disable no-console */
/**
 * API Usage Examples
 *
 * This file demonstrates how to use the Axios API client.
 * These are examples only - not executable tests.
 */

import { get, post } from '../api';
import { getTodaysGospel, getGospelByDate } from '../gospelService';
import { ApiError } from '@/types/api';

// Example 1: Simple GET request with type safety
async function exampleGetRequest() {
  interface User {
    id: string;
    email: string;
    name: string;
  }

  try {
    const response = await get<User>('/users/me');
    console.log('User:', response.data); // Type: User
    console.log('Success:', response.success); // Type: true
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Error:', error.message);
      console.error('Code:', error.code);
      console.error('Status:', error.statusCode);
    }
  }
}

// Example 2: POST request with body
async function examplePostRequest() {
  interface CreateUserDto {
    email: string;
    name: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }

  try {
    const response = await post<User, CreateUserDto>('/users', {
      email: 'user@example.com',
      name: 'John Doe',
    });
    console.log('Created user:', response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to create user:', error.message);
    }
  }
}

// Example 3: Using the Gospel service
async function exampleGospelService() {
  try {
    // Get today's gospel
    const todayResponse = await getTodaysGospel();
    console.log('Today:', todayResponse.data.liturgicalDay);
    console.log('Gospel:', todayResponse.data.readings.gospel.text);

    // Get gospel for specific date
    const dateResponse = await getGospelByDate('2025-11-11');
    console.log('Date:', dateResponse.data.date);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Gospel fetch error:', error.message);
    }
  }
}

// Example 4: Handling pagination
async function examplePagination() {
  interface Article {
    id: string;
    title: string;
    content: string;
  }

  try {
    const response = await get<Article[]>('/articles', {
      params: {
        page: 1,
        limit: 10,
      },
    });

    console.log('Articles:', response.data);
    console.log('Page:', response.meta?.page);
    console.log('Total:', response.meta?.total);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Error fetching articles:', error.message);
    }
  }
}

// Example 5: Error handling with specific codes
async function exampleErrorHandling() {
  try {
    const response = await get<unknown>('/some-endpoint');
    console.log('Success:', response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'NOT_FOUND':
          console.error('Resource not found');
          break;
        case 'VALIDATION_ERROR':
          console.error('Invalid input:', error.details);
          break;
        case 'UNAUTHORIZED':
          console.error('Please log in');
          break;
        case 'NETWORK_ERROR':
          console.error('Check your internet connection');
          break;
        default:
          console.error('Unexpected error:', error.message);
      }
    }
  }
}

export {
  exampleGetRequest,
  examplePostRequest,
  exampleGospelService,
  examplePagination,
  exampleErrorHandling,
};
