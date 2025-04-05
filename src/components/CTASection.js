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
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/register">Apply as Babysitter</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-blue-500 hover:text-white"
              asChild
            >
              <Link to="/login">Babysitter Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 