import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function PublicLayout({ children }) {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              DayStarConnect
            </Link>
            <nav className="flex space-x-4">
              {!isRegisterPage ? (
                <Link to="/enrollment" className="text-gray-600 hover:text-gray-900">
                  Back to Enrollment
                </Link>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
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