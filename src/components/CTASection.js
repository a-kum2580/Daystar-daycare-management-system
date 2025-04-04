import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function CTASection() {
  return (
    <section className="bg-blue-500">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to transform your daycare?</span>
          <span className="block text-blue-100">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white"
              >
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 