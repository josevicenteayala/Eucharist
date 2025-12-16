'use client';

import { useMiracles } from '@/hooks/useMiracles';
import Link from 'next/link';
import { useState } from 'react';

export default function MiraclesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useMiracles({ page, limit: 9 });

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
        <p>Error loading miracles. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-secondary-900">Eucharistic Miracles</h1>

      {data?.data.length === 0 ? (
        <p className="text-gray-600">No miracles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.data.map((miracle) => (
            <Link key={miracle._id} href={`/miracles/${miracle.slug}`} className="block group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                {miracle.images && miracle.images[0] && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={miracle.images[0].url}
                      alt={miracle.images[0].caption || miracle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-accent-50 text-accent-700 rounded-full">
                      {miracle.location.country}
                    </span>
                    <span className="text-xs text-gray-400">
                      {miracle.date.approximateDate || miracle.date.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {miracle.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {miracle.summary}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                    <span className="truncate">
                      {miracle.location.city}, {miracle.location.country}
                    </span>
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
