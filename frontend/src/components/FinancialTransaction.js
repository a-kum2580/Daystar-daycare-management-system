import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { financialService } from '../services/financialService';
import { formatCurrency } from '../utils/formatters';
import { theme } from '../config/theme';

const FinancialTransaction = () => {
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    status: 'pending',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const incomeCategories = [
    'tuition',
    'registration',
    'late_pickup',
    'other'
  ];

  const expenseCategories = [
    'salaries',
    'supplies',
    'maintenance',
    'utilities',
    'rent',
    'other'
  ];

  const paymentMethods = [
    'cash',
    'check',
    'credit_card',
    'bank_transfer',
    'other'
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.type) errors.type = 'Transaction type is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = 'Valid amount is required';
    }
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.paymentMethod) errors.paymentMethod = 'Payment method is required';
    if (!formData.status) errors.status = 'Status is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await financialService.recordTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setSuccess('Transaction recorded successfully');
      setTimeout(() => setSuccess(null), 3000);
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        status: 'pending',
        description: ''
      });
    } catch (error) {
      setError('Failed to record transaction');
      console.error('Error recording transaction:', error);
    } finally {
      setLoading(false);
    }
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
        Record Transaction
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
            <Label htmlFor="type" style={{ color: theme.colors.gray[800] }}>
              Transaction Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange({ target: { name: 'type', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                '& .SelectTrigger': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  border: `1px solid ${theme.colors.gray[300]}`,
                  padding: '0.5rem 1rem',
                  borderRadius: theme.borderRadius.md
                },
                '& .SelectContent': {
                  backgroundColor: 'white',
                  border: `1px solid ${theme.colors.gray[300]}`,
                  boxShadow: theme.boxShadow.md,
                  borderRadius: theme.borderRadius.md,
                  marginTop: '0.25rem'
                },
                '& .SelectItem': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  padding: '0.5rem 1rem',
                  '&:hover': {
                    backgroundColor: theme.colors.gray[100]
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category" style={{ color: theme.colors.gray[800] }}>
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                '& .SelectTrigger': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  border: `1px solid ${theme.colors.gray[300]}`,
                  padding: '0.5rem 1rem',
                  borderRadius: theme.borderRadius.md
                },
                '& .SelectContent': {
                  backgroundColor: 'white',
                  border: `1px solid ${theme.colors.gray[300]}`,
                  boxShadow: theme.boxShadow.md,
                  borderRadius: theme.borderRadius.md,
                  marginTop: '0.25rem'
                },
                '& .SelectItem': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  padding: '0.5rem 1rem',
                  '&:hover': {
                    backgroundColor: theme.colors.gray[100]
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {formData.type === 'income'
                  ? incomeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))
                  : expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" style={{ color: theme.colors.gray[800] }}>
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            />
            {validationErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.amount}</p>
            )}
            {formData.amount && !validationErrors.amount && (
              <p className="text-sm mt-1" style={{ color: theme.colors.gray[500] }}>
                {formatCurrency(parseFloat(formData.amount))}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="date" style={{ color: theme.colors.gray[800] }}>
              Date
            </Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            />
            {validationErrors.date && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMethod" style={{ color: theme.colors.gray[800] }}>
              Payment Method
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange({ target: { name: 'paymentMethod', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                '& .SelectTrigger': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  border: `1px solid ${theme.colors.gray[300]}`,
                  padding: '0.5rem 1rem',
                  borderRadius: theme.borderRadius.md
                },
                '& .SelectContent': {
                  backgroundColor: 'white',
                  border: `1px solid ${theme.colors.gray[300]}`,
                  boxShadow: theme.boxShadow.md,
                  borderRadius: theme.borderRadius.md,
                  marginTop: '0.25rem'
                },
                '& .SelectItem': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  padding: '0.5rem 1rem',
                  '&:hover': {
                    backgroundColor: theme.colors.gray[100]
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>
                    {method.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.paymentMethod}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status" style={{ color: theme.colors.gray[800] }}>
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: 'white',
                '& .SelectTrigger': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  border: `1px solid ${theme.colors.gray[300]}`,
                  padding: '0.5rem 1rem',
                  borderRadius: theme.borderRadius.md
                },
                '& .SelectContent': {
                  backgroundColor: 'white',
                  border: `1px solid ${theme.colors.gray[300]}`,
                  boxShadow: theme.boxShadow.md,
                  borderRadius: theme.borderRadius.md,
                  marginTop: '0.25rem'
                },
                '& .SelectItem': {
                  backgroundColor: 'white',
                  color: theme.colors.gray[800],
                  padding: '0.5rem 1rem',
                  '&:hover': {
                    backgroundColor: theme.colors.gray[100]
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.status && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.status}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description" style={{ color: theme.colors.gray[800] }}>
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            style={{
              borderColor: theme.colors.gray[300],
              backgroundColor: theme.colors.gray[50]
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
          {loading ? 'Recording...' : 'Record Transaction'}
        </Button>
      </form>
    </Card>
  );
};

export default FinancialTransaction; 