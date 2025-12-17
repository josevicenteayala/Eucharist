'use client';

import { usePrayer } from '@/hooks/usePrayers';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PrayerDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data: prayer, isLoading, error } = usePrayer(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prayer not found</h2>
        <Link href="/prayers" className="text-primary-600 hover:text-primary-700 font-medium">
          &larr; Back to Prayers
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/prayers"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors"
      >
        &larr; Back to Prayers
      </Link>

      <header className="mb-12 text-center">
        <span className="inline-block text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full mb-4">
          {prayer.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6 leading-tight">
          {prayer.title}
        </h1>
        {prayer.author && <p className="text-gray-500 italic">— {prayer.author}</p>}
      </header>

      <div className="bg-amber-50/30 p-8 md:p-12 rounded-2xl border border-amber-100 shadow-sm">
        <div className="prose prose-lg prose-p:text-gray-800 prose-p:leading-relaxed text-center font-serif">
          {prayer.text.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      {prayer.latinText && (
        <div className="mt-8 p-8 md:p-12 rounded-2xl border border-gray-100 bg-gray-50">
          <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Latin
          </h3>
          <div className="prose prose-lg prose-p:text-gray-600 prose-p:leading-relaxed text-center font-serif italic">
            {prayer.latinText.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {prayer.usage && prayer.usage.length > 0 && (
        <div className="mt-12 text-center text-sm text-gray-500">
          <span className="font-bold mr-2">Usage:</span>
          {prayer.usage.join(', ')}
        </div>
      )}
    </article>
  );
}
