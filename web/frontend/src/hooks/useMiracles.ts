import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface Miracle {
  _id: string;
  title: string;
  slug: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  date: {
    year: number;
    month?: number;
    approximateDate?: string;
  };
  summary: string;
  fullStory: string;
  scientificEvidence?: {
    tested: boolean;
    findings?: string;
  };
  images?: {
    url: string;
    caption?: string;
  }[];
  tags: string[];
}

export interface MiraclesResponse {
  data: Miracle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MiraclesParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  year?: number;
}

export const useMiracles = (params: MiraclesParams = {}) => {
  return useQuery({
    queryKey: ['miracles', params],
    queryFn: async () => {
      const { data } = await api.get<MiraclesResponse>('/miracles', { params });
      return data;
    },
  });
};

export const useMiracle = (slug: string) => {
  return useQuery({
    queryKey: ['miracle', slug],
    queryFn: async () => {
      const { data } = await api.get<Miracle>(`/miracles/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};
