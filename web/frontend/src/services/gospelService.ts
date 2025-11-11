/**
 * Gospel Service
 * 
 * API service for fetching daily gospel readings and reflections.
 * Demonstrates proper usage of the Axios API client.
 */

import { get } from './api';

/**
 * Gospel Reading data structure
 */
export interface GospelReading {
  id: string;
  date: string;
  liturgicalDay: string;
  readings: {
    first?: {
      reference: string;
      text: string;
      citation: string;
    };
    psalm?: {
      reference: string;
      text: string;
      response: string;
    };
    second?: {
      reference: string;
      text: string;
      citation: string;
    };
    gospel: {
      reference: string;
      text: string;
      citation: string;
    };
  };
  reflection?: {
    title: string;
    content: string;
    author?: string;
  };
}

/**
 * Get today's gospel reading
 * 
 * @returns Promise with today's gospel reading data
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await getTodaysGospel();
 *   console.log(response.data);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('Failed to fetch gospel:', error.message);
 *   }
 * }
 * ```
 */
export async function getTodaysGospel() {
  return get<GospelReading>('/gospel/today');
}

/**
 * Get gospel reading for a specific date
 * 
 * @param date - Date in ISO format (YYYY-MM-DD)
 * @returns Promise with gospel reading data for the specified date
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * const response = await getGospelByDate('2025-11-11');
 * console.log(response.data);
 * ```
 */
export async function getGospelByDate(date: string) {
  return get<GospelReading>(`/gospel/${date}`);
}

/**
 * Get gospel readings for a date range
 * 
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD)
 * @returns Promise with array of gospel readings
 * @throws ApiError if request fails
 */
export async function getGospelRange(startDate: string, endDate: string) {
  return get<GospelReading[]>('/gospel/range', {
    params: { startDate, endDate }
  });
}

/**
 * Search gospel readings by keyword
 * 
 * @param query - Search query string
 * @param options - Optional search parameters
 * @returns Promise with search results
 * @throws ApiError if request fails
 */
export async function searchGospel(
  query: string,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  return get<GospelReading[]>('/gospel/search', {
    params: { q: query, ...options }
  });
}
