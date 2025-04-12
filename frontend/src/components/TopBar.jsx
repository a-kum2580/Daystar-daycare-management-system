import React from 'react';
import ThemeToggle from './ThemeToggle';

const TopBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Daystar Daycare</h1>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {/* Add other top bar items here */}
      </div>
    </div>
  );
};

export default TopBar; 