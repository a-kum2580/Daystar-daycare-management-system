import React from "react";

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About DayStarConnect
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            DayStarConnect is a comprehensive childcare management system designed to help daycare centres streamline their operations and provide better care for children.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-blue-500 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To provide innovative solutions that enhance the quality of childcare services and make daycare centre management easier and more efficient.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-blue-500 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To become the leading childcare management solution in Zambia, empowering daycare centres to provide exceptional care and education.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-blue-500 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Values</h3>
            <p className="text-gray-600">
              We believe in excellence, innovation, and putting the needs of children and caregivers first in everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 