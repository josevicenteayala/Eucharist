'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              User Profile
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Welcome, {user?.first_name} {user?.last_name}
            </h1>
            <p className="mt-2 text-gray-500">
              This is a protected page. You can only see this if you are logged in.
            </p>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <button
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
