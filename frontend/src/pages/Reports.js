import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { formatCurrency } from '../utils/formatters';

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', description: 'Daily attendance records' },
    { id: 'financial', name: 'Financial Report', description: 'Revenue and expenses summary' },
    { id: 'children', name: 'Children Report', description: 'Enrollment and activities' },
    { id: 'babysitter', name: 'Babysitter Report', description: 'Performance and attendance' },
    { id: 'monthly', name: 'Monthly Summary', description: 'Comprehensive monthly report' }
  ];

  const formats = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
    { id: 'csv', name: 'CSV' }
  ];

  // Sample data for existing reports
  const existingReports = [
    {
      id: 1,
      name: 'April Attendance Report',
      type: 'attendance',
      lastGenerated: '2024-04-15',
      status: 'Ready',
      size: '2.5 MB'
    },
    {
      id: 2,
      name: 'Q1 Financial Summary',
      type: 'financial',
      lastGenerated: '2024-04-01',
      status: 'Ready',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'March Children Activities',
      type: 'children',
      lastGenerated: '2024-03-31',
      status: 'Ready',
      size: '3.2 MB'
    }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const generateReport = async () => {
    if (!selectedReport) {
      showNotification('Please select a report type', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const reportType = reportTypes.find(r => r.id === selectedReport);
      let content;
      let mimeType;
      let fileExtension;

      // Generate content based on format
      if (format === 'csv') {
        mimeType = 'text/csv';
        fileExtension = 'csv';
        if (selectedReport === 'attendance') {
          const headers = ['Date', 'Child Name', 'Check-in Time', 'Check-out Time', 'Status'];
          const rows = [
            ['2024-04-15', 'John Doe', '08:00', '17:00', 'Present'],
            ['2024-04-15', 'Sarah Smith', '08:30', '16:30', 'Present'],
            ['2024-04-15', 'Michael Brown', '09:00', '17:00', 'Present']
          ];
          content = [headers, ...rows].map(row => row.join(',')).join('\n');
        } else if (selectedReport === 'financial') {
          const headers = ['Date', 'Description', 'Amount', 'Type'];
          const rows = [
            ['2024-04-15', 'Full Day - John Doe', '5000', 'Income'],
            ['2024-04-15', 'Half Day - Sarah Smith', '3000', 'Income'],
            ['2024-04-15', 'Staff Salary', '3000', 'Expense']
          ];
          content = [headers, ...rows].map(row => row.join(',')).join('\n');
        }
      } else if (format === 'excel') {
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        // For Excel, we'll create a simple HTML table that Excel can open
        if (selectedReport === 'attendance') {
          content = `
            <table>
              <tr>
                <th>Date</th>
                <th>Child Name</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Status</th>
              </tr>
              <tr>
                <td>2024-04-15</td>
                <td>John Doe</td>
                <td>08:00</td>
                <td>17:00</td>
                <td>Present</td>
              </tr>
              <tr>
                <td>2024-04-15</td>
                <td>Sarah Smith</td>
                <td>08:30</td>
                <td>16:30</td>
                <td>Present</td>
              </tr>
            </table>
          `;
        } else if (selectedReport === 'financial') {
          content = `
            <table>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
              <tr>
                <td>2024-04-15</td>
                <td>Full Day - John Doe</td>
                <td>5000</td>
                <td>Income</td>
              </tr>
              <tr>
                <td>2024-04-15</td>
                <td>Half Day - Sarah Smith</td>
                <td>3000</td>
                <td>Income</td>
              </tr>
            </table>
          `;
        }
      } else {
        // PDF format
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        content = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #333; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>${reportType.name}</h1>
              <p>Generated: ${new Date().toLocaleDateString()}</p>
              <p>Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}</p>
              <p>${reportType.description}</p>
              ${selectedReport === 'attendance' ? `
                <h2>Daily Attendance Records</h2>
                <table>
                  <tr>
                    <th>Date</th>
                    <th>Child Name</th>
                    <th>Check-in Time</th>
                    <th>Check-out Time</th>
                    <th>Status</th>
                  </tr>
                  <tr>
                    <td>2024-04-15</td>
                    <td>John Doe</td>
                    <td>08:00</td>
                    <td>17:00</td>
                    <td>Present</td>
                  </tr>
                  <tr>
                    <td>2024-04-15</td>
                    <td>Sarah Smith</td>
                    <td>08:30</td>
                    <td>16:30</td>
                    <td>Present</td>
                  </tr>
                </table>
              ` : selectedReport === 'financial' ? `
                <h2>Financial Summary</h2>
                <table>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                  <tr>
                    <td>2024-04-15</td>
                    <td>Full Day - John Doe</td>
                    <td>${formatCurrency(5000)} UGX</td>
                    <td>Income</td>
                  </tr>
                  <tr>
                    <td>2024-04-15</td>
                    <td>Half Day - Sarah Smith</td>
                    <td>${formatCurrency(3000)} UGX</td>
                    <td>Income</td>
                  </tr>
                </table>
              ` : ''}
            </body>
          </html>
        `;
      }

      const fileName = `${reportType.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;

      // Create and download the file
      if (format === 'pdf') {
        // For PDF, we'll use the browser's print functionality
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
      } else {
        // For CSV and Excel
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      showNotification(`Report generated successfully! (${fileName})`);
    } catch (error) {
      showNotification('Failed to generate report. Please try again.', 'error');
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewReport = (reportId) => {
    const report = existingReports.find(r => r.id === reportId);
    if (report) {
      // Create a new window with the report content
      const printWindow = window.open('', '_blank');
      const content = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${report.name}</h1>
            <p>Generated: ${new Date(report.lastGenerated).toLocaleDateString()}</p>
            <p>Type: ${report.type}</p>
            <p>Status: ${report.status}</p>
            <p>Size: ${report.size}</p>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
    }
  };

  const handleDownloadReport = (reportId) => {
    const report = existingReports.find(r => r.id === reportId);
    if (report) {
      // Create a simple HTML table for the report
      const content = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${report.name}</h1>
            <p>Generated: ${new Date(report.lastGenerated).toLocaleDateString()}</p>
            <p>Type: ${report.type}</p>
            <p>Status: ${report.status}</p>
            <p>Size: ${report.size}</p>
          </body>
        </html>
      `;

      const blob = new Blob([content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification(`Report downloaded successfully! (${report.name})`);
    }
  };

  return (
    <div className="space-y-6">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Select report type and format</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={generateReport}
              disabled={isGenerating || !selectedReport}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>View and download previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{new Date(report.lastGenerated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Reports; 