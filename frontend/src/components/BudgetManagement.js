import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { financialService } from '../services/financialService';
import { notificationService } from '../services/notificationService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { theme } from '../config/theme';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    threshold: 80
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getBudgets();
      setBudgets(data);

      // Check for budget threshold alerts
      for (const budget of data) {
        const expenses = await financialService.getExpensesByCategory(
          budget.category,
          budget.period
        );
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const thresholdAmount = (budget.amount * budget.threshold) / 100;
        
        if (totalExpenses >= thresholdAmount) {
          await notificationService.sendBudgetAlert(
            budget.category,
            totalExpenses,
            thresholdAmount
          );
        }
      }
    } catch (error) {
      setError('Failed to load budgets');
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = 'Valid amount is required';
    }
    if (!formData.period) errors.period = 'Period is required';
    if (!formData.threshold || isNaN(formData.threshold) || formData.threshold < 1 || formData.threshold > 100) {
      errors.threshold = 'Threshold must be between 1 and 100';
    }
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
      await financialService.createBudget({
        ...formData,
        amount: parseFloat(formData.amount),
        threshold: parseInt(formData.threshold)
      });
      setSuccess('Budget created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
        threshold: 80
      });
      loadBudgets();
    } catch (error) {
      setError('Failed to create budget');
      console.error('Error creating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6" style={{ 
      backgroundColor: theme.colors.gray[50],
      boxShadow: theme.boxShadow.lg
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ 
          color: theme.colors.primary[700],
          fontFamily: theme.typography.fontFamily.sans.join(',')
        }}>
          Budget Management
        </h2>
        <Button 
          onClick={loadBudgets} 
          disabled={loading}
          style={{
            backgroundColor: theme.colors.primary[500],
            color: 'white',
            '&:hover': {
              backgroundColor: theme.colors.primary[600]
            }
          }}
        >
          Refresh
        </Button>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category" style={{ color: theme.colors.gray[800] }}>
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
          </div>

          <div>
            <Label htmlFor="period" style={{ color: theme.colors.gray[800] }}>
              Period
            </Label>
            <Select
              value={formData.period}
              onValueChange={(value) => handleChange({ target: { name: 'period', value } })}
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.period && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.period}</p>
            )}
          </div>

          <div>
            <Label htmlFor="threshold" style={{ color: theme.colors.gray[800] }}>
              Alert Threshold (%)
            </Label>
            <Input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              min="1"
              max="100"
              placeholder="Enter threshold percentage"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            />
            {validationErrors.threshold && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.threshold}</p>
            )}
          </div>
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
          {loading ? 'Creating...' : 'Create Budget'}
        </Button>
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.colors.primary[500] }}
          ></div>
          <p className="mt-4" style={{ color: theme.colors.gray[600] }}>
            Loading budgets...
          </p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8" style={{ color: theme.colors.gray[500] }}>
          No budgets found
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map(budget => (
            <div
              key={budget.id}
              className="flex items-center justify-between p-4 border rounded-lg"
              style={{
                borderColor: theme.colors.gray[200],
                backgroundColor: theme.colors.gray[50]
              }}
            >
              <div>
                <p className="font-medium" style={{ color: theme.colors.gray[800] }}>
                  {budget.category}
                </p>
                <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                  {formatCurrency(budget.amount)} per {budget.period}
                </p>
                <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                  Alert at {budget.threshold}%
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this budget?')) {
                    financialService.deleteBudget(budget.id).then(loadBudgets);
                  }
                }}
                style={{
                  borderColor: theme.colors.error[300],
                  color: theme.colors.error[600],
                  '&:hover': {
                    backgroundColor: theme.colors.error[50]
                  }
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default BudgetManagement; 