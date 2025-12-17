'use client';

import { useArticle } from '@/hooks/useArticles';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data: article, isLoading, error } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
        <Link href="/articles" className="text-primary-600 hover:text-primary-700 font-medium">
          &larr; Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/articles"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors"
      >
        &larr; Back to Articles
      </Link>

      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm font-medium px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-gray-500">{article.readingTime} min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center justify-center text-gray-500 gap-4">
          <span className="font-medium text-gray-900">{article.author.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {article.coverImage && (
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            className="w-full h-auto object-cover max-h-[600px]"
          />
          {article.coverImage.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
              {article.coverImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="prose prose-lg prose-primary max-w-none prose-headings:font-bold prose-headings:text-secondary-900 prose-p:text-gray-700 prose-a:text-primary-600">
        {article.content
          .split('\n')
          .map((paragraph, idx) => (paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />))}
        {/* Note: In a real app we'd use a markdown renderer like react-markdown */}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
