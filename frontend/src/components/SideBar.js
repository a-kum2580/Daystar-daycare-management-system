import React from "react";
import { Link, useLocation } from "react-router-dom";
import authService from "../services/authService";

const managerNavigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/children', label: 'Children', icon: '👶' },
  { path: '/attendance', label: 'Attendance', icon: '📝' },
  { path: '/calendar', label: 'Calendar', icon: '📅' },
  { path: '/finance', label: 'Finance', icon: '💰' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' }
];

const babysitterNavigationItems = [
  { path: '/babysitter-dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/reports', label: 'Incident Reports', icon: '📝' },
  { path: '/calendar', label: 'Schedule', icon: '📅' }
];

export function SideBar() {
  const location = useLocation();
  const user = authService.getCurrentUser();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navigationItems = user?.role === 'manager' ? managerNavigationItems : babysitterNavigationItems;

  return (
    <div className="h-full w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-500">DayStar<span className="text-yellow-400">Connect</span></h1>
      </div>
      <div className="flex flex-col p-4">
        <p className="mb-4 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
          {user?.role === 'manager' ? 'Management' : 'Babysitter'}
        </p>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive(item.path)
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-300"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SideBar; 