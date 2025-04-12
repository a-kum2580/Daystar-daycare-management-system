import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const PAYMENT_RATES = {
  regular: 50000,    // UGX per child per session
  overnight: 100000, // UGX per child per session
  emergency: 75000,  // UGX per child per session
  special_event: 60000 // UGX per child per session
};

export function BabysitterPayments() {
  const [selectedBabysitter, setSelectedBabysitter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('half-day');
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [payments, setPayments] = useState([]);

  const calculatePayment = () => {
    const rate = PAYMENT_RATES[sessionType];
    return rate * numberOfChildren;
  };

  const handleAddPayment = () => {
    if (!selectedBabysitter) return;

    const newPayment = {
      id: Date.now(),
      babysitter: selectedBabysitter,
      date: selectedDate,
      sessionType,
      numberOfChildren,
      amount: calculatePayment(),
      status: 'pending'
    };

    setPayments([...payments, newPayment]);
  };

  const handleClearPayment = (paymentId) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId ? { ...payment, status: 'cleared' } : payment
    ));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' UGX';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Babysitter Payments</h1>
        <Button>Generate Report</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Payment Record</CardTitle>
          <CardDescription>Enter payment details for a babysitter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="babysitter">Babysitter</Label>
              <Select onValueChange={setSelectedBabysitter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select babysitter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-type">Session Type</Label>
              <Select onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half-day">Half Day (2,000K per child)</SelectItem>
                  <SelectItem value="full-day">Full Day (5,000K per child)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Number of Children</Label>
              <Input
                id="children"
                type="number"
                min="1"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddPayment}>Add Payment Record</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>View and manage payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Babysitter</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.babysitter}</TableCell>
                  <TableCell>{payment.sessionType}</TableCell>
                  <TableCell>{payment.numberOfChildren}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleClearPayment(payment.id)}
                      >
                        Clear Payment
                      </Button>
                    )}
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