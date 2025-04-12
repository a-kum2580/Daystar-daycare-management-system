import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { financialService } from '../services/financialService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { theme } from '../config/theme';

const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [period, setPeriod] = useState('monthly');
  const [financialData, setFinancialData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadFinancialData();
    loadBudgetData();
  }, [dateRange, period]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialService.getFinancialSummary(
        dateRange.startDate,
        dateRange.endDate
      );
      setFinancialData(data);
    } catch (error) {
      setError('Failed to load financial data');
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBudgetData = async () => {
    try {
      const data = await financialService.getBudgets(period);
      setBudgetData(data);
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);
      await financialService.exportReport(
        dateRange.startDate,
        dateRange.endDate,
        format
      );
    } catch (error) {
      setError('Failed to export report');
      console.error('Error exporting report:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleDateChange = (e, type) => {
    const value = e.target.value;
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6" style={{ 
        backgroundColor: theme.colors.gray[50],
        boxShadow: theme.boxShadow.lg
      }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" style={{ 
            color: theme.colors.primary[700],
            fontFamily: theme.typography.fontFamily.sans.join(',')
          }}>
            Financial Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange(e, 'startDate')}
              className="border rounded px-3 py-2"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            />
            <span style={{ color: theme.colors.gray[600] }}>to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange(e, 'endDate')}
              className="border rounded px-3 py-2"
              style={{
                borderColor: theme.colors.gray[300],
                backgroundColor: theme.colors.gray[50]
              }}
            />
            <Select
              value={period}
              onValueChange={setPeriod}
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
            <Button 
              onClick={loadFinancialData} 
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
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: theme.colors.primary[500] }}
            ></div>
            <p className="mt-4" style={{ color: theme.colors.gray[600] }}>
              Loading financial data...
            </p>
          </div>
        ) : financialData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6" style={{ 
              backgroundColor: theme.colors.success[50],
              borderColor: theme.colors.success[200]
            }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: theme.colors.gray[800] }}>
                Total Income
              </h3>
              <p className="text-2xl font-bold" style={{ color: theme.colors.success[600] }}>
                {formatCurrency(financialData.totalIncome)}
              </p>
            </Card>

            <Card className="p-6" style={{ 
              backgroundColor: theme.colors.error[50],
              borderColor: theme.colors.error[200]
            }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: theme.colors.gray[800] }}>
                Total Expenses
              </h3>
              <p className="text-2xl font-bold" style={{ color: theme.colors.error[600] }}>
                {formatCurrency(financialData.totalExpenses)}
              </p>
            </Card>

            <Card className="p-6" style={{ 
              backgroundColor: theme.colors.primary[50],
              borderColor: theme.colors.primary[200]
            }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: theme.colors.gray[800] }}>
                Net Income
              </h3>
              <p className="text-2xl font-bold" style={{ color: theme.colors.primary[600] }}>
                {formatCurrency(financialData.netIncome)}
              </p>
            </Card>

            <Card className="p-6" style={{ 
              backgroundColor: theme.colors.warning[50],
              borderColor: theme.colors.warning[200]
            }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: theme.colors.gray[800] }}>
                Budget Adherence
              </h3>
              <p className="text-2xl font-bold" style={{ color: theme.colors.warning[600] }}>
                {financialData.budgetAdherence}%
              </p>
            </Card>
          </div>
        ) : null}
      </Card>

      {budgetData && (
        <Card className="p-6" style={{ 
          backgroundColor: theme.colors.gray[50],
          boxShadow: theme.boxShadow.lg
        }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.gray[800] }}>
            Budget Overview
          </h3>
          <div className="space-y-4">
            {budgetData.map(budget => (
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
                </div>
                <div className="text-right">
                  <p className="font-medium" style={{ color: theme.colors.gray[800] }}>
                    {formatCurrency(budget.spent)}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.gray[500] }}>
                    {((budget.spent / budget.amount) * 100).toFixed(1)}% spent
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          style={{
            backgroundColor: theme.colors.primary[500],
            color: 'white',
            '&:hover': {
              backgroundColor: theme.colors.primary[600]
            }
          }}
        >
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
        <Button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          style={{
            backgroundColor: theme.colors.primary[500],
            color: 'white',
            '&:hover': {
              backgroundColor: theme.colors.primary[600]
            }
          }}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>
    </div>
  );
};

export default FinancialDashboard; 