'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Frontend Error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-secondary-900 mb-4">Something went wrong!</h2>
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 max-w-lg">
        <p className="font-mono text-sm">{error.message || 'An unexpected error occurred.'}</p>
      </div>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="px-6 py-3 bg-secondary-900 text-white font-medium rounded-lg hover:bg-secondary-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
