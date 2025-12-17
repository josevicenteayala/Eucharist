'use client';

import { useMiracle } from '@/hooks/useMiracles';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MiracleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data: miracle, isLoading, error } = useMiracle(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !miracle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Miracle not found</h2>
        <Link href="/miracles" className="text-primary-600 hover:text-primary-700 font-medium">
          &larr; Back to Miracles
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/miracles"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors"
      >
        &larr; Back to Miracles
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium px-3 py-1 bg-accent-50 text-accent-700 rounded-full">
            {miracle.location.country}
          </span>
          <span className="text-sm text-gray-500">
            {miracle.date.approximateDate || miracle.date.year}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 leading-tight">
          {miracle.title}
        </h1>
        <p className="text-xl text-gray-600">
          {miracle.location.city}, {miracle.location.country}
        </p>
      </header>

      {miracle.images && miracle.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {miracle.images.map((img, idx) => (
            <figure key={idx} className="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              <img
                src={img.url}
                alt={img.caption || `Image of ${miracle.title}`}
                className="w-full h-auto object-cover"
              />
              {img.caption && (
                <figcaption className="p-3 text-center text-sm text-gray-500 bg-white border-t border-gray-100">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <div className="bg-primary-50 p-6 rounded-2xl mb-12 border border-primary-100">
        <h3 className="font-bold text-primary-900 mb-2">Summary</h3>
        <p className="text-primary-800 leading-relaxed">{miracle.summary}</p>
      </div>

      <div className="prose prose-lg prose-primary max-w-none prose-headings:font-bold prose-headings:text-secondary-900 prose-p:text-gray-700">
        {miracle.fullStory
          .split('\n')
          .map((paragraph, idx) => (paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />))}
      </div>

      {miracle.scientificEvidence && (
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-secondary-900 mb-4">Scientific Evidence</h3>
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${miracle.scientificEvidence.tested ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
            >
              {miracle.scientificEvidence.tested ? 'Scientifically Tested' : 'Not Tested'}
            </div>
          </div>
          {miracle.scientificEvidence.findings && (
            <p className="text-gray-700">{miracle.scientificEvidence.findings}</p>
          )}
        </div>
      )}
    </article>
  );
}
