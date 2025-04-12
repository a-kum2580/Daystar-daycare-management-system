import React, { useState } from 'react';
import { Card } from './ui/card';

const Schedule = () => {
  const [currentDay, setCurrentDay] = useState(new Date());

  const activities = [
    {
      time: '08:00 AM',
      activity: 'Arrival & Free Play',
      description: 'Welcome children as they arrive'
    },
    {
      time: '09:00 AM',
      activity: 'Circle Time',
      description: 'Morning songs, weather, calendar'
    },
    {
      time: '09:30 AM',
      activity: 'Learning Activities',
      description: 'Age-appropriate educational activities'
    },
    {
      time: '10:30 AM',
      activity: 'Snack Time',
      description: 'Morning healthy snack'
    },
    {
      time: '11:00 AM',
      activity: 'Outdoor Play',
      description: 'Weather permitting'
    },
    {
      time: '12:00 PM',
      activity: 'Lunch Time',
      description: 'Nutritious lunch and social time'
    },
    {
      time: '01:00 PM',
      activity: 'Nap/Quiet Time',
      description: 'Rest period for all children'
    },
    {
      time: '03:00 PM',
      activity: 'Afternoon Activities',
      description: 'Arts, crafts, and free play'
    },
    {
      time: '04:00 PM',
      activity: 'Story Time',
      description: 'Group reading and discussion'
    },
    {
      time: '05:00 PM',
      activity: 'Departure',
      description: 'Clean up and prepare for home'
    }
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const adjustDay = (days) => {
    const newDate = new Date(currentDay);
    newDate.setDate(currentDay.getDate() + days);
    setCurrentDay(newDate);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Daily Schedule</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => adjustDay(-1)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-600 font-medium">{formatDate(currentDay)}</span>
          <button
            onClick={() => adjustDay(1)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="flex-shrink-0 w-24">
              <span className="font-medium text-gray-600">{item.time}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.activity}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Schedule; 