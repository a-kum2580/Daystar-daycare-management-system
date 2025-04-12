import React from 'react';
import { Card } from './ui/card';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Children',
      value: '45',
      change: '+2.5%',
      changeType: 'increase'
    },
    {
      title: 'Active Staff',
      value: '12',
      change: 'No change',
      changeType: 'neutral'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      change: '-1%',
      changeType: 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <span className={`ml-2 text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' :
              stat.changeType === 'decrease' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats; 