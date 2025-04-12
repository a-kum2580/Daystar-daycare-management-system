import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatCurrency } from '../utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog";

export function Finance() {
  const [timeRange, setTimeRange] = useState('month');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('financial');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Sample data - in a real app, this would come from an API
  const transactions = [
    {
      id: 1,
      date: '2024-04-01',
      description: 'Full Day - John Doe',
      amount: 5000,
      status: 'Paid',
      type: 'income'
    },
    {
      id: 2,
      date: '2024-04-02',
      description: 'Staff Salary - Jane Smith',
      amount: 3000,
      status: 'Paid',
      type: 'expense'
    },
    {
      id: 3,
      date: '2024-04-03',
      description: 'Half Day - Sarah Johnson',
      amount: 3000,
      status: 'Pending',
      type: 'income'
    },
    {
      id: 4,
      date: '2024-04-04',
      description: 'Full Day - Michael Brown',
      amount: 5000,
      status: 'Paid',
      type: 'income'
    },
    {
      id: 5,
      date: '2024-04-05',
      description: 'Half Day - Emily Davis',
      amount: 3000,
      status: 'Paid',
      type: 'income'
    }
  ];

  const calculateTotals = () => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.revenue += transaction.amount;
        if (transaction.status === 'Pending') {
          acc.pending += transaction.amount;
        }
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    }, { revenue: 0, pending: 0, expenses: 0 });
  };

  const totals = calculateTotals();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Prepare report data based on type
      let reportData;
      switch (reportType) {
        case 'financial':
          reportData = {
            title: 'Financial Summary Report',
            timeRange,
            totals,
            summary: `This report shows the financial summary for ${timeRange}.`
          };
          break;
        case 'transactions':
          reportData = {
            title: 'Transaction History Report',
            timeRange,
            transactions,
            summary: `This report shows all transactions for ${timeRange}.`
          };
          break;
        case 'revenue':
          reportData = {
            title: 'Revenue Analysis Report',
            timeRange,
            revenue: totals.revenue,
            pending: totals.pending,
            summary: `This report analyzes revenue for ${timeRange}.`
          };
          break;
        case 'expenses':
          reportData = {
            title: 'Expense Report',
            timeRange,
            expenses: totals.expenses,
            transactions: transactions.filter(t => t.type === 'expense'),
            summary: `This report details expenses for ${timeRange}.`
          };
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Create the report content based on format
      let content;
      const fileName = `${reportData.title.toLowerCase().replace(/\s+/g, '-')}-${timeRange}.${reportFormat}`;

      if (reportFormat === 'csv') {
        // Create CSV content
        if (reportType === 'transactions' || reportType === 'expenses') {
          const headers = ['Date', 'Description', 'Type', 'Amount', 'Status'];
          const rows = reportData.transactions.map(t => [
            t.date,
            t.description,
            t.type,
            t.amount,
            t.status
          ]);
          content = [headers, ...rows].map(row => row.join(',')).join('\n');
        } else {
          const headers = ['Category', 'Amount'];
          const rows = [
            ['Total Revenue', reportData.totals?.revenue || reportData.revenue],
            ['Pending Payments', reportData.totals?.pending || reportData.pending],
            ['Total Expenses', reportData.totals?.expenses || reportData.expenses]
          ];
          content = [headers, ...rows].map(row => row.join(',')).join('\n');
        }
      } else if (reportFormat === 'excel') {
        // For Excel, we'll create a CSV that can be opened in Excel
        if (reportType === 'transactions' || reportType === 'expenses') {
          const headers = ['Date', 'Description', 'Type', 'Amount', 'Status'];
          const rows = reportData.transactions.map(t => [
            t.date,
            t.description,
            t.type,
            t.amount,
            t.status
          ]);
          content = [headers, ...rows].map(row => row.join('\t')).join('\n');
        } else {
          const headers = ['Category', 'Amount'];
          const rows = [
            ['Total Revenue', reportData.totals?.revenue || reportData.revenue],
            ['Pending Payments', reportData.totals?.pending || reportData.pending],
            ['Total Expenses', reportData.totals?.expenses || reportData.expenses]
          ];
          content = [headers, ...rows].map(row => row.join('\t')).join('\n');
        }
      } else {
        // For PDF, we'll create a simple text version
        content = `
${reportData.title}
Time Range: ${timeRange}
Generated: ${new Date().toLocaleDateString()}

${reportData.summary}

${reportType === 'transactions' || reportType === 'expenses' ? 
  reportData.transactions.map(t => `
Date: ${t.date}
Description: ${t.description}
Type: ${t.type}
Amount: ${formatCurrency(t.amount)} UGX
Status: ${t.status}
-------------------`).join('\n') :
  `
Total Revenue: ${formatCurrency(reportData.totals?.revenue || reportData.revenue)} UGX
Pending Payments: ${formatCurrency(reportData.totals?.pending || reportData.pending)} UGX
Total Expenses: ${formatCurrency(reportData.totals?.expenses || reportData.expenses)} UGX
`}
        `;
      }

      // Create and download the file
      const blob = new Blob([content], { 
        type: reportFormat === 'pdf' ? 'application/pdf' : 
              reportFormat === 'excel' ? 'application/vnd.ms-excel' : 
              'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification(`Report downloaded successfully! (${fileName})`);
      setIsReportDialogOpen(false);
    } catch (error) {
      showNotification('Failed to generate report. Please try again.', 'error');
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
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
        <h1 className="text-3xl font-bold">Finance</h1>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button>Generate Report</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate Financial Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Summary</SelectItem>
                      <SelectItem value="transactions">Transaction History</SelectItem>
                      <SelectItem value="revenue">Revenue Analysis</SelectItem>
                      <SelectItem value="expenses">Expense Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
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
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsReportDialogOpen(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={generateReport}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>This {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totals.revenue)} UGX</p>
            <p className="text-sm text-gray-500 mt-2">+12% from last {timeRange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
            <CardDescription>This {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{formatCurrency(totals.pending)} UGX</p>
            <p className="text-sm text-gray-500 mt-2">3 payments pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>This {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totals.expenses)} UGX</p>
            <p className="text-sm text-gray-500 mt-2">-5% from last {timeRange}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and manage financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(transaction.amount)} UGX
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
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

export default Finance; 