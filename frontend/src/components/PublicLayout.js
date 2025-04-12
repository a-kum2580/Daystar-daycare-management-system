import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function PublicLayout({ children }) {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              DayStarConnect
            </Link>
            <nav className="flex space-x-4">
              {!isRegisterPage ? (
                <Link to="/enrollment" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Back to Enrollment
                </Link>
              ) : (
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Already have an account? Sign in
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 