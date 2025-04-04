import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">DayStar<span className="text-yellow-400">Connect</span></h3>
            <p className="text-gray-600 text-sm">
              Providing quality childcare management solutions for daycare centers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-blue-500">Features</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-500">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@daystarconnect.com</li>
              <li>Phone: +260 97X XXX XXX</li>
              <li>Address: Lusaka, Zambia</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} DayStarConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 