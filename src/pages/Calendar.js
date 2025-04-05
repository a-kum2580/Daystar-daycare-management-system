import React from "react";
import { Link } from "react-router-dom";

export function Calendar() {
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
        <h1 className="text-3xl font-bold text-gray-900">Daycare Calendar</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Parent-Teacher Conference</h3>
              <p className="text-gray-600">March 15, 2024</p>
              <p className="text-gray-600">9:00 AM - 5:00 PM</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Spring Festival</h3>
              <p className="text-gray-600">March 20, 2024</p>
              <p className="text-gray-600">10:00 AM - 2:00 PM</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold">Staff Development Day</h3>
              <p className="text-gray-600">March 25, 2024</p>
              <p className="text-gray-600">Center Closed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Important Dates</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold">Enrollment Deadline</h3>
              <p className="text-gray-600">April 1, 2024</p>
              <p className="text-gray-600">For Summer Program</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">Summer Program Starts</h3>
              <p className="text-gray-600">June 1, 2024</p>
              <p className="text-gray-600">First Day of Summer Session</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Holidays & Closures</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="font-semibold">Good Friday</h3>
              <p className="text-gray-600">March 29, 2024</p>
              <p className="text-gray-600">Center Closed</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="font-semibold">Easter Monday</h3>
              <p className="text-gray-600">April 1, 2024</p>
              <p className="text-gray-600">Center Closed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Themes</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">March: Spring Exploration</h3>
              <p className="text-gray-600">Nature walks, planting activities</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">April: Community Helpers</h3>
              <p className="text-gray-600">Learning about different professions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 