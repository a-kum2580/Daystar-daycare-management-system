import { create } from 'zustand';
import brain from 'brain';
import { toast } from 'sonner';

// Type definitions for attendance data
export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string
  person_id: string;
  person_type: 'child' | 'babysitter';
  check_in_time: string | null; // ISO datetime string
  check_out_time: string | null; // ISO datetime string
  status: 'present' | 'absent' | 'late' | 'early_departure';
  notes?: string;
  modified_by?: string;
  modified_at?: string; // ISO datetime string
}

export interface CheckInOutRequest {
  person_id: string;
  person_type: 'child' | 'babysitter';
  notes?: string;
}

interface AttendanceFilter {
  start_date?: string;
  end_date?: string;
  person_id?: string;
  person_type?: 'child' | 'babysitter';
  status?: 'present' | 'absent' | 'late' | 'early_departure';
}

interface AttendanceState {
  records: AttendanceRecord[];
  dailyRecords: AttendanceRecord[];
  currentRecord: AttendanceRecord | null;
  selectedDate: string; // ISO date string
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAttendanceRecords: (filter?: AttendanceFilter) => Promise<void>;
  fetchDailyAttendance: (date: string, personType?: 'child' | 'babysitter') => Promise<void>;
  fetchAttendanceRecord: (id: string) => Promise<void>;
  checkIn: (request: CheckInOutRequest) => Promise<AttendanceRecord | null>;
  checkOut: (request: CheckInOutRequest) => Promise<AttendanceRecord | null>;
  updateAttendance: (id: string, record: Partial<AttendanceRecord>) => Promise<boolean>;
  deleteAttendance: (id: string) => Promise<boolean>;
  setSelectedDate: (date: string) => void;
}

const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  dailyRecords: [],
  currentRecord: null,
  selectedDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  isLoading: false,
  error: null,
  
  fetchAttendanceRecords: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      // Convert filter dates to ISO strings if provided
      const queryParams: any = {};
      if (filter) {
        if (filter.start_date) queryParams.start_date = filter.start_date;
        if (filter.end_date) queryParams.end_date = filter.end_date;
        if (filter.person_id) queryParams.person_id = filter.person_id;
        if (filter.person_type) queryParams.person_type = filter.person_type;
        if (filter.status) queryParams.status = filter.status;
      }
      
      // Make the API call
      const response = await brain.get_all_attendance(queryParams);
      const data = await response.json();
      set({ records: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      set({ error: 'Failed to fetch attendance records', isLoading: false });
      toast.error('Failed to fetch attendance records');
      return [];
    }
  },
  
  fetchDailyAttendance: async (date, personType) => {
    set({ isLoading: true, error: null });
    try {
      // Construct query parameters
      const queryParams: any = {};
      if (personType) queryParams.person_type = personType;
      
      const response = await brain.get_daily_attendance({ date_str: date }, queryParams);
      const data = await response.json();
      set({ dailyRecords: data, isLoading: false, selectedDate: date });
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      set({ error: 'Failed to fetch daily attendance', isLoading: false });
      toast.error('Failed to fetch daily attendance');
    }
  },
  
  fetchAttendanceRecord: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_attendance({ attendance_id: id });
      const data = await response.json();
      set({ currentRecord: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      set({ error: 'Failed to fetch attendance details', isLoading: false });
      toast.error('Failed to fetch attendance details');
    }
  },
  
  checkIn: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.check_in(request);
      const data = await response.json();
      
      // Update the daily records if we're viewing today
      const today = new Date().toISOString().split('T')[0];
      if (get().selectedDate === today) {
        set(state => ({
          dailyRecords: [...state.dailyRecords.filter(r => 
            !(r.person_id === request.person_id && r.person_type === request.person_type)), data],
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
      toast.success(`${request.person_type === 'child' ? 'Child' : 'Babysitter'} checked in successfully`);
      return data;
    } catch (error) {
      console.error('Error checking in:', error);
      const errorMessage = error.message || 'Failed to check in';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },
  
  checkOut: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.check_out(request);
      const data = await response.json();
      
      // Update the daily records if we're viewing today
      const today = new Date().toISOString().split('T')[0];
      if (get().selectedDate === today) {
        set(state => ({
          dailyRecords: state.dailyRecords.map(record => 
            record.person_id === request.person_id && 
            record.person_type === request.person_type ? data : record
          ),
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
      toast.success(`${request.person_type === 'child' ? 'Child' : 'Babysitter'} checked out successfully`);
      return data;
    } catch (error) {
      console.error('Error checking out:', error);
      const errorMessage = error.message || 'Failed to check out';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },
  
  updateAttendance: async (id, recordUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_attendance({ attendance_id: id }, recordUpdate);
      const updatedRecord = await response.json();
      
      // Update the records in state
      set(state => ({
        records: state.records.map(record => 
          record.id === id ? updatedRecord : record
        ),
        dailyRecords: state.dailyRecords.map(record => 
          record.id === id ? updatedRecord : record
        ),
        currentRecord: state.currentRecord?.id === id ? updatedRecord : state.currentRecord,
        isLoading: false
      }));
      
      toast.success('Attendance record updated');
      return true;
    } catch (error) {
      console.error('Error updating attendance record:', error);
      set({ error: 'Failed to update attendance record', isLoading: false });
      toast.error('Failed to update attendance record');
      return false;
    }
  },
  
  deleteAttendance: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_attendance({ attendance_id: id });
      
      // Remove the record from all state arrays
      set(state => ({
        records: state.records.filter(record => record.id !== id),
        dailyRecords: state.dailyRecords.filter(record => record.id !== id),
        currentRecord: state.currentRecord?.id === id ? null : state.currentRecord,
        isLoading: false
      }));
      
      toast.success('Attendance record deleted');
      return true;
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      set({ error: 'Failed to delete attendance record', isLoading: false });
      toast.error('Failed to delete attendance record');
      return false;
    }
  },
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
  }
}));

export default useAttendanceStore;
