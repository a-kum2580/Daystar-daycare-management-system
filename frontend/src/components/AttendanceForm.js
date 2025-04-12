import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { attendanceService, childService, babysitterService } from '../services';

const AttendanceForm = ({ type, recordId, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    notes: '',
    status: 'present',
    childId: '',
    babysitterId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [childrenData, babysittersData] = await Promise.all([
        childService.getAllChildren(),
        babysitterService.getAllBabysitters()
      ]);
      setChildren(childrenData);
      setBabysitters(babysittersData);

      if (recordId) {
        const record = await attendanceService.getAttendanceRecord(recordId);
        setFormData(record);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (recordId) {
        await attendanceService.updateAttendanceRecord(recordId, formData);
        toast.success('Attendance record updated successfully');
      } else {
        await attendanceService.createAttendanceRecord(formData);
        toast.success('Attendance record created successfully');
      }
      if (onSubmit) onSubmit();
    } catch (error) {
      toast.error(error.message || 'Failed to save attendance record');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>

        {type === 'child' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Child</label>
            <select
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Child</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === 'babysitter' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Babysitter</label>
            <select
              name="babysitterId"
              value={formData.babysitterId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Babysitter</option>
              {babysitters.map(babysitter => (
                <option key={babysitter.id} value={babysitter.id}>
                  {babysitter.firstName} {babysitter.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Check In Time</label>
          <input
            type="time"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Check Out Time</label>
          <input
            type="time"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Saving...' : recordId ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm; 