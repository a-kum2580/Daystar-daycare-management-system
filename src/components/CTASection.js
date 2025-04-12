import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Team of Professional Babysitters
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Make a difference in children's lives while earning competitive pay and flexible hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply as Babysitter
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Babysitter Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 