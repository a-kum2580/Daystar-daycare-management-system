import api from './api.config';

const babysitterService = {
  getAllBabysitters: async () => {
    try {
      const response = await api.get('/babysitters');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitters' };
    }
  },

  getBabysitterById: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter details' };
    }
  },

  createBabysitter: async (babysitterData) => {
    try {
      const response = await api.post('/babysitters', babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create babysitter' };
    }
  },

  updateBabysitter: async (id, babysitterData) => {
    try {
      const response = await api.put(`/babysitters/${id}`, babysitterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter' };
    }
  },

  deleteBabysitter: async (id) => {
    try {
      const response = await api.delete(`/babysitters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete babysitter' };
    }
  },

  getBabysitterSchedule: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}/schedule`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter schedule' };
    }
  },

  updateBabysitterSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/babysitters/${id}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update babysitter schedule' };
    }
  },

  getBabysitterPerformance: async (id) => {
    try {
      const response = await api.get(`/babysitters/${id}/performance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch babysitter performance' };
    }
  },

  async getBabysitters({ search, page, limit }) {
    // Mock data - replace with actual API call
    const mockBabysitters = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Mike Johnson' }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter based on search term if provided
    const filteredBabysitters = search
      ? mockBabysitters.filter(b => 
          b.name.toLowerCase().includes(search.toLowerCase())
        )
      : mockBabysitters;

    // Simulate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBabysitters = filteredBabysitters.slice(start, end);

    return {
      data: paginatedBabysitters,
      total: filteredBabysitters.length
    };
  },

  async getSchedules({ date, page, limit }) {
    // Mock data - replace with actual API call
    const mockSchedules = [
      {
        id: '1',
        babysitterId: '1',
        date: '2024-04-01',
        startTime: '09:00',
        endTime: '17:00',
        status: 'present'
      },
      {
        id: '2',
        babysitterId: '2',
        date: '2024-04-01',
        startTime: '10:00',
        endTime: '18:00',
        status: 'absent'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter based on date if provided
    const filteredSchedules = date
      ? mockSchedules.filter(s => s.date === date)
      : mockSchedules;

    // Simulate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedSchedules = filteredSchedules.slice(start, end);

    return {
      data: paginatedSchedules,
      total: filteredSchedules.length
    };
  },

  async createSchedule(scheduleData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate a mock response
      const mockResponse = {
        data: {
          id: Date.now().toString(),
          ...scheduleData,
          createdAt: new Date().toISOString()
        }
      };

      return mockResponse;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create schedule' };
    }
  },

  async generateReport({ startDate, endDate }) {
    // Mock data - replace with actual API call
    const mockSchedules = [
      {
        date: '2024-04-01',
        babysitter: 'John Doe',
        time: '09:00 - 17:00',
        status: 'present'
      },
      {
        date: '2024-04-01',
        babysitter: 'Jane Smith',
        time: '10:00 - 18:00',
        status: 'absent'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create CSV content
    const csvContent = [
      ['Date', 'Babysitter', 'Time', 'Status'],
      ...mockSchedules.map(row => [row.date, row.babysitter, row.time, row.status])
    ].map(row => row.join(',')).join('\n');

    return csvContent;
  }
};

export default babysitterService; 