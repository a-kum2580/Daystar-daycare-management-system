import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">Daystar<span className="text-yellow-400">Daycare</span></h3>
            <p className="text-gray-600 text-sm">
              Providing a secure, nurturing, and stimulating environment for young children.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-500">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-600 hover:text-blue-500">Programs</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/parent-guide" className="text-gray-600 hover:text-blue-500">Parent Guide</Link></li>
              <li><Link to="/enrollment" className="text-gray-600 hover:text-blue-500">Enrollment</Link></li>
              <li><Link to="/calendar" className="text-gray-600 hover:text-blue-500">Calendar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@daystardaycare.com</li>
              <li>Phone: +260 97X XXX XXX</li>
              <li>Address: Lusaka, Zambia</li>
              <li>Hours: Mon-Fri, 7:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Daystar Daycare Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 