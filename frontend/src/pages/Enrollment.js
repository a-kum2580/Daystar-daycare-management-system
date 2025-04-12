import React from "react";
import { Link } from "react-router-dom";

export function Enrollment() {
  const handleEnrollClick = (e) => {
    e.preventDefault();
    window.location.href = '/enroll-child';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link 
          to="/" 
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Enrollment Process</h1>
      </div>

      {/* Prominent Enroll Button */}
      <div className="mb-8 bg-blue-100 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Ready to Enroll Your Child?</h2>
        <p className="text-blue-700 mb-6">
          Complete our simple enrollment form to get started with the registration process.
        </p>
        <button 
          onClick={handleEnrollClick}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Enroll Your Child Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 1: Initial Inquiry</h2>
          <p className="text-gray-600 mb-4">
            Contact us to schedule a tour of our facility and meet our staff. This is a great opportunity to see our environment and ask any questions you may have.
          </p>
          <button 
            onClick={handleEnrollClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Schedule a Tour
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 2: Application</h2>
          <p className="text-gray-600 mb-4">
            Complete our enrollment application form. This includes information about your child, emergency contacts, and any special needs or requirements.
          </p>
          <button 
            onClick={handleEnrollClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Start Application
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 3: Documentation</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Child's birth certificate</li>
            <li>• Immunization records</li>
            <li>• Medical information</li>
            <li>• Emergency contact details</li>
            <li>• Parent/guardian identification</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Step 4: Orientation</h2>
          <p className="text-gray-600 mb-4">
            Attend our orientation session where we'll go over our policies, daily routines, and answer any remaining questions you may have.
          </p>
          <button 
            onClick={handleEnrollClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Schedule Orientation
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          Our enrollment team is here to assist you through every step of the process. Contact us for any questions or concerns.
        </p>
        <button 
          onClick={handleEnrollClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Contact Enrollment Team
        </button>
      </div>
    </div>
  );
} 