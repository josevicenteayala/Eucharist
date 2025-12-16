import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  excerpt: string;
  coverImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  author: {
    name: string;
    bio?: string;
  };
  publishedAt: string;
  readingTime?: number;
}

export interface ArticlesResponse {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
}

export const useArticles = (params: ArticlesParams = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      const { data } = await api.get<ArticlesResponse>('/articles', { params });
      return data;
    },
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data } = await api.get<Article>(`/articles/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};
