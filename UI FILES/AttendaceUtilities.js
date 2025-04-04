import { format, parseISO } from 'date-fns';
import { AttendanceRecord } from './attendanceStore';

/**
 * Format a date string for display
 * @param dateStr ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

/**
 * Format a time string for display
 * @param timeStr ISO datetime string
 * @returns Formatted time string
 */
export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '--';
  return format(parseISO(timeStr), 'h:mm a');
}

/**
 * Get the duration between check-in and check-out
 * @param record Attendance record
 * @returns Duration string (e.g. '8h 30m') or '--' if incomplete
 */
export function getDuration(record: AttendanceRecord): string {
  if (!record.check_in_time || !record.check_out_time) return '--';
  
  const checkIn = parseISO(record.check_in_time);
  const checkOut = parseISO(record.check_out_time);
  
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHours}h ${diffMinutes}m`;
}

/**
 * Calculate attendance status based on check-in time
 * @param record Attendance record
 * @returns Status ('present', 'absent', 'late', or 'early_departure')
 */
export function calculateAttendanceStatus(record: AttendanceRecord): string {
  if (!record.check_in_time) return 'absent';
  
  const checkIn = parseISO(record.check_in_time);
  const scheduledStart = new Date(checkIn);
  scheduledStart.setHours(8, 0, 0, 0); // Assuming 8:00 AM start time
  
  // Late if checked in more than 15 minutes after scheduled start
  if (checkIn.getTime() - scheduledStart.getTime() > 15 * 60 * 1000) {
    return 'late';
  }
  
  // Early departure if checked out before scheduled end (assume 8-hour day)
  if (record.check_out_time) {
    const checkOut = parseISO(record.check_out_time);
    const scheduledEnd = new Date(scheduledStart);
    scheduledEnd.setHours(scheduledStart.getHours() + 8);
    
    if (checkOut.getTime() < scheduledEnd.getTime() - 15 * 60 * 1000) {
      return 'early_departure';
    }
  }
  
  return 'present';
}

/**
 * Get color class for attendance status
 * @param status Attendance status
 * @returns Tailwind color class
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'present':
      return 'text-green-500';
    case 'absent':
      return 'text-red-500';
    case 'late':
      return 'text-amber-500';
    case 'early_departure':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Group attendance records by date
 * @param records Array of attendance records
 * @returns Object with dates as keys and arrays of records as values
 */
export function groupByDate(records: AttendanceRecord[]): Record<string, AttendanceRecord[]> {
  return records.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);
}
