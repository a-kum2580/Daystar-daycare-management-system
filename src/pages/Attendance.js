import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { attendanceService } from "../services";
import { toast } from "sonner";

export function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("children");

  const fetchDailyAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const personType = activeTab === "children" ? "child" : "babysitter";
      const data = await attendanceService.getDailyAttendance(selectedDate, personType);
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to load attendance data");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, activeTab]);

  useEffect(() => {
    fetchDailyAttendance();
  }, [fetchDailyAttendance]);

  const handleCheckIn = async (personId) => {
    try {
      const personType = activeTab === "children" ? "child" : "babysitter";
      await attendanceService.checkIn({
        person_id: personId,
        person_type: personType,
        notes: "Checked in via system"
      });
      toast.success("Check-in recorded successfully");
      fetchDailyAttendance();
    } catch (err) {
      console.error("Error checking in:", err);
      toast.error("Failed to record check-in");
    }
  };

  const handleCheckOut = async (personId) => {
    try {
      const personType = activeTab === "children" ? "child" : "babysitter";
      await attendanceService.checkOut({
        person_id: personId,
        person_type: personType,
        notes: "Checked out via system"
      });
      toast.success("Check-out recorded successfully");
      fetchDailyAttendance();
    } catch (err) {
      console.error("Error checking out:", err);
      toast.error("Failed to record check-out");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <Button onClick={fetchDailyAttendance}>Refresh</Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Daily Attendance</CardTitle>
          <CardDescription>Track attendance for children and babysitters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="children" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="children">Children</TabsTrigger>
              <TabsTrigger value="babysitters">Babysitters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="children">
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading attendance data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No attendance records found for this date</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.person_name}</TableCell>
                        <TableCell>{record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : '-'}</TableCell>
                        <TableCell>{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {!record.check_in_time ? (
                            <Button size="sm" onClick={() => handleCheckIn(record.person_id)}>Check In</Button>
                          ) : !record.check_out_time ? (
                            <Button size="sm" variant="outline" onClick={() => handleCheckOut(record.person_id)}>Check Out</Button>
                          ) : (
                            <span className="text-gray-500">Completed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="babysitters">
              {/* Similar content as children tab but for babysitters */}
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Loading attendance data...</p>
                </div>
              ) : error ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No attendance records found for this date</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.person_name}</TableCell>
                        <TableCell>{record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : '-'}</TableCell>
                        <TableCell>{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {!record.check_in_time ? (
                            <Button size="sm" onClick={() => handleCheckIn(record.person_id)}>Check In</Button>
                          ) : !record.check_out_time ? (
                            <Button size="sm" variant="outline" onClick={() => handleCheckOut(record.person_id)}>Check Out</Button>
                          ) : (
                            <span className="text-gray-500">Completed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Attendance; 