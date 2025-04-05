import React from "react";
import { SideBar } from "./SideBar";
import { Link } from "react-router-dom";

export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
        <Link
          to="/babysitter-scheduling"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Babysitter Scheduling
        </Link>
      </main>
    </div>
  );
}

export default DashboardLayout; 