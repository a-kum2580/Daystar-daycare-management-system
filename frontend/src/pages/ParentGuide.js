import React from "react";
import { Link } from "react-router-dom";

export function ParentGuide() {
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
        <h1 className="text-3xl font-bold text-gray-900">Parent Guide</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Drop-off: 7:00 AM - 8:30 AM</li>
            <li>• Morning Activities: 8:30 AM - 11:30 AM</li>
            <li>• Lunch: 11:30 AM - 12:30 PM</li>
            <li>• Nap Time: 12:30 PM - 2:30 PM</li>
            <li>• Afternoon Activities: 2:30 PM - 5:00 PM</li>
            <li>• Pick-up: 5:00 PM - 6:00 PM</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">What to Bring</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Extra set of clothes</li>
            <li>• Diapers and wipes (if needed)</li>
            <li>• Comfort items (blanket, stuffed animal)</li>
            <li>• Water bottle</li>
            <li>• Sunscreen and hat</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Policies</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Illness Policy</li>
            <li>• Payment Schedule</li>
            <li>• Late Pick-up Fees</li>
            <li>• Vacation Policy</li>
            <li>• Emergency Procedures</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Communication</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Daily Reports</li>
            <li>• Parent-Teacher Meetings</li>
            <li>• Emergency Contacts</li>
            <li>• Newsletter</li>
            <li>• Mobile App Updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 