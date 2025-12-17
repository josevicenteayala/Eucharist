import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface Prayer {
  _id: string;
  title: string;
  slug: string;
  category: string;
  usage: string[];
  text: string;
  latinText?: string;
  author?: string;
  source?: string;
  tags: string[];
}

export interface PrayersResponse {
  data: Prayer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PrayersParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  usage?: string;
}

export const usePrayers = (params: PrayersParams = {}) => {
  return useQuery({
    queryKey: ['prayers', params],
    queryFn: async () => {
      const { data } = await api.get<PrayersResponse>('/prayers', { params });
      return data;
    },
  });
};

export const usePrayer = (slug: string) => {
  return useQuery({
    queryKey: ['prayer', slug],
    queryFn: async () => {
      const { data } = await api.get<Prayer>(`/prayers/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};
