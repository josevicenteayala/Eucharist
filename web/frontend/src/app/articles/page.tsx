'use client';

import { useArticles } from '@/hooks/useArticles';
import Link from 'next/link';
import { useState } from 'react';

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useArticles({ page, limit: 9 });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>Error loading articles. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-secondary-900">Articles</h1>

      {data?.data.length === 0 ? (
        <p className="text-gray-600">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.data.map((article) => (
            <Link key={article._id} href={`/articles/${article.slug}`} className="block group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                {article.coverImage && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage.url}
                      alt={article.coverImage.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readingTime} min read</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                    <span>{article.author.name}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
