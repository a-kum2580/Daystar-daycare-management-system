import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';
import { babysitterService } from '../services/babysitterService';
import { theme } from '../config/theme';
import { Calendar as CalendarIcon } from 'lucide-react';
import Calendar from './ui/calendar';

const BabysitterScheduling = () => {
  const [formData, setFormData] = useState({
    babysitterId: '',
    sessionType: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const sessionTypes = [
    'regular',
    'overnight',
    'emergency',
    'special_event'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
    setShowCalendar(false);
    if (validationErrors.date) {
      setValidationErrors(prev => ({
        ...prev,
        date: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add validation and submission logic here
  };

  return (
    <Card className="p-6" style={{ 
      backgroundColor: theme.colors.gray[50],
      boxShadow: theme.boxShadow.lg
    }}>
      <h2 className="text-2xl font-semibold mb-6" style={{ 
        color: theme.colors.primary[700],
        fontFamily: theme.typography.fontFamily.sans.join(',')
      }}>
        Schedule Babysitter
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="babysitterId" style={{ color: theme.colors.gray[800] }}>
              Babysitter
            </Label>
            <Select
              value={formData.babysitterId}
              onValueChange={(value) => handleChange({ target: { name: 'babysitterId', value } })}
              className="bg-white border border-gray-300 rounded-md min-w-[200px]"
            >
              <SelectTrigger style={{ backgroundColor: 'white', opacity: 1 }}>
                <SelectValue placeholder="Select babysitter" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'white', opacity: 1 }}>
                {babysitters.map(babysitter => (
                  <SelectItem 
                    key={babysitter.id} 
                    value={babysitter.id}
                    style={{ backgroundColor: 'white', opacity: 1 }}
                  >
                    {babysitter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.babysitterId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.babysitterId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sessionType" style={{ color: theme.colors.gray[800] }}>
              Session Type
            </Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value) => handleChange({ target: { name: 'sessionType', value } })}
              className="bg-white border border-gray-300 rounded-md min-w-[200px]"
            >
              <SelectTrigger style={{ backgroundColor: 'white', opacity: 1 }}>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'white', opacity: 1 }}>
                {sessionTypes.map(type => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    style={{ backgroundColor: 'white', opacity: 1 }}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.sessionType && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.sessionType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" style={{ color: theme.colors.gray[800] }}>
              Date
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                placeholder="Select date"
                className="w-full pr-10"
                style={{
                  borderColor: theme.colors.gray[300],
                  backgroundColor: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  width: '100%'
                }}
              />
              <div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
                style={{ color: theme.colors.gray[500] }}
              >
                <CalendarIcon size={20} />
              </div>
              {showCalendar && (
                <div className="absolute z-10 mt-2">
                  <Calendar onDateSelect={handleDateSelect} />
                </div>
              )}
            </div>
            {validationErrors.date && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="startTime" style={{ color: theme.colors.gray[800] }}>
              Start Time
            </Label>
            <Input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                padding: '0.5rem 1rem',
                borderRadius: theme.borderRadius.md
              }}
            />
            {validationErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.startTime}</p>
            )}
          </div>

          <div>
            <Label htmlFor="endTime" style={{ color: theme.colors.gray[800] }}>
              End Time
            </Label>
            <Input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                padding: '0.5rem 1rem',
                borderRadius: theme.borderRadius.md
              }}
            />
            {validationErrors.endTime && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.endTime}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" style={{ color: theme.colors.gray[800] }}>
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full"
            style={{
              borderColor: theme.colors.gray[300],
              backgroundColor: 'white',
              padding: '0.5rem 1rem',
              borderRadius: theme.borderRadius.md
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: theme.colors.primary[500],
            color: 'white',
            '&:hover': {
              backgroundColor: theme.colors.primary[600]
            }
          }}
        >
          {loading ? 'Scheduling...' : 'Schedule Session'}
        </Button>
      </form>
    </Card>
  );
};

export default BabysitterScheduling; 