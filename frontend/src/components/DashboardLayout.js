import React from "react";
import { SideBar } from "./SideBar";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.role === 'manager' ? 'Manager Dashboard' : 'Babysitter Dashboard'}
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout; 