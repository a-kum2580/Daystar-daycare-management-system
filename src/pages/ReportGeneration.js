import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import * as XLSX from 'xlsx/xlsx.mjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ReportGeneration() {
  const [reportData, setReportData] = useState({
    reportType: '',
    startDate: '',
    endDate: '',
    format: 'pdf'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!reportData.reportType || !reportData.startDate || !reportData.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Generate report based on type and format
      let reportContent = '';
      const fileName = `${reportData.reportType}_report_${new Date().toISOString().split('T')[0]}`;

      switch (reportData.reportType) {
        case 'attendance':
          reportContent = generateAttendanceReport();
          break;
        case 'financial':
          reportContent = generateFinancialReport();
          break;
        case 'babysitter':
          reportContent = generateBabysitterReport();
          break;
        case 'incidents':
          reportContent = generateIncidentsReport();
          break;
        case 'children':
          reportContent = generateChildrenReport();
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Convert to selected format and download
      if (reportData.format === 'csv') {
        downloadCSV(reportContent, fileName);
      } else if (reportData.format === 'excel') {
        downloadExcel(reportContent, fileName);
      } else {
        downloadPDF(reportContent, fileName);
      }

      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAttendanceReport = () => {
    // Mock data - replace with actual data from your backend
    return [
      ['Date', 'Child Name', 'Check In', 'Check Out', 'Status'],
      ['2024-03-01', 'John Doe', '08:00 AM', '04:00 PM', 'Present'],
      ['2024-03-01', 'Jane Smith', '08:30 AM', '03:30 PM', 'Present'],
      ['2024-03-01', 'Mike Johnson', '09:00 AM', '04:00 PM', 'Present'],
    ];
  };

  const generateFinancialReport = () => {
    // Mock data - replace with actual data from your backend
    return [
      ['Date', 'Description', 'Amount', 'Category'],
      ['2024-03-01', 'Tuition Payment', '$500', 'Income'],
      ['2024-03-01', 'Supplies', '$100', 'Expense'],
      ['2024-03-01', 'Utilities', '$200', 'Expense'],
    ];
  };

  const generateBabysitterReport = () => {
    // Mock data - replace with actual data from your backend
    return [
      ['Babysitter', 'Hours Worked', 'Children Cared For', 'Performance Rating'],
      ['Sarah Wilson', '40', '8', 'Excellent'],
      ['Mike Brown', '35', '6', 'Good'],
      ['Lisa Chen', '38', '7', 'Very Good'],
    ];
  };

  const generateIncidentsReport = () => {
    // Mock data - replace with actual data from your backend
    return [
      ['Date', 'Child Name', 'Incident Type', 'Description', 'Action Taken'],
      ['2024-03-01', 'John Doe', 'Minor Injury', 'Scraped knee', 'First aid applied'],
      ['2024-03-01', 'Jane Smith', 'Behavior', 'Tantrum', 'Calming techniques used'],
    ];
  };

  const generateChildrenReport = () => {
    // Mock data - replace with actual data from your backend
    return [
      ['Child Name', 'Age', 'Attendance', 'Progress Notes', 'Parent Feedback'],
      ['John Doe', '4', '90%', 'Good progress in social skills', 'Very satisfied'],
      ['Jane Smith', '3', '85%', 'Improving in language development', 'Satisfied'],
    ];
  };

  const downloadCSV = (data, fileName) => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const downloadExcel = (data, fileName) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const downloadPDF = (data, fileName) => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(fileName.replace(/_/g, ' ').toUpperCase(), 14, 15);
      
      // Add date range if available
      if (reportData.startDate && reportData.endDate) {
        doc.setFontSize(10);
        doc.text(`Period: ${reportData.startDate} to ${reportData.endDate}`, 14, 25);
      }
      
      // Add table using autoTable
      autoTable(doc, {
        head: [data[0]],
        body: data.slice(1),
        startY: 35,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateReport();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select
                  name="reportType"
                  value={reportData.reportType}
                  onValueChange={(value) => setReportData(prev => ({ ...prev, reportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="babysitter">Babysitter Performance</SelectItem>
                    <SelectItem value="incidents">Incident Reports</SelectItem>
                    <SelectItem value="children">Children's Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Report Format</Label>
                <Select
                  name="format"
                  value={reportData.format}
                  onValueChange={(value) => setReportData(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={reportData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={reportData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 