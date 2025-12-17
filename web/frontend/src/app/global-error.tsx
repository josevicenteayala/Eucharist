'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Critical Error</h2>
          <p className="text-xl text-gray-600 mb-8">
            Something went wrong in the application layout.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
