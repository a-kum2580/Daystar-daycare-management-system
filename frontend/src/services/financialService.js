import api from './api.config';

// Mock data for demonstration
const mockIncome = [
  {
    id: '1',
    date: '2023-12-01',
    type: 'daycare_fee',
    amount: 500000,
    childId: '1',
    sessionType: 'full-day',
    paymentMethod: 'mobile_money',
    status: 'paid',
    description: 'Monthly fee for John Doe'
  },
  // Add more income records
];

const mockExpenses = [
  {
    id: '1',
    date: '2023-12-01',
    category: 'salaries',
    amount: 2000000,
    description: 'Staff salaries for November',
    paymentMethod: 'bank_transfer',
    status: 'paid'
  },
  {
    id: '2',
    date: '2023-12-02',
    category: 'supplies',
    amount: 500000,
    description: 'Toys and educational materials',
    paymentMethod: 'cash',
    status: 'paid'
  },
  // Add more expense records
];

const mockBudgets = [
  {
    id: '1',
    category: 'salaries',
    amount: 2000000,
    period: 'monthly',
    startDate: '2023-12-01',
    endDate: '2023-12-31'
  },
  {
    id: '2',
    category: 'supplies',
    amount: 500000,
    period: 'monthly',
    startDate: '2023-12-01',
    endDate: '2023-12-31'
  },
  // Add more budget records
];

export const financialService = {
  // Income Management
  getAllIncome: async (filters = {}) => {
    try {
      // For now, return mock data
      return mockIncome;
    } catch (error) {
      console.error('Error fetching income:', error);
      throw new Error('Failed to fetch income records');
    }
  },

  createIncome: async (incomeData) => {
    try {
      // For now, just add to mock data
      const newIncome = {
        id: String(mockIncome.length + 1),
        ...incomeData,
        status: 'paid'
      };
      mockIncome.push(newIncome);
      return newIncome;
    } catch (error) {
      console.error('Error creating income:', error);
      throw new Error('Failed to create income record');
    }
  },

  updateIncome: async (incomeId, incomeData) => {
    try {
    const response = await api.put(`/income/${incomeId}`, incomeData);
    return response.data;
    } catch (error) {
      console.error('Error updating income:', error);
      throw new Error('Failed to update income record');
    }
  },

  deleteIncome: async (incomeId) => {
    try {
    const response = await api.delete(`/income/${incomeId}`);
    return response.data;
    } catch (error) {
      console.error('Error deleting income:', error);
      throw new Error('Failed to delete income record');
    }
  },

  // Expense Categories
  getAllCategories: async () => {
    try {
    const response = await api.get('/expense-categories');
    return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch expense categories');
    }
  },

  createCategory: async (categoryData) => {
    try {
    const response = await api.post('/expense-categories', categoryData);
    return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create expense category');
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
    const response = await api.put(`/expense-categories/${categoryId}`, categoryData);
    return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update expense category');
    }
  },

  deleteCategory: async (categoryId) => {
    try {
    const response = await api.delete(`/expense-categories/${categoryId}`);
    return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete expense category');
    }
  },

  // Expenses
  getAllExpenses: async (filters = {}) => {
    try {
      // For now, return mock data
      return mockExpenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expense records');
    }
  },

  createExpense: async (expenseData) => {
    try {
      // For now, just add to mock data
      const newExpense = {
        id: String(mockExpenses.length + 1),
        ...expenseData,
        status: 'paid'
      };
      mockExpenses.push(newExpense);
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense record');
    }
  },

  updateExpense: async (expenseId, expenseData) => {
    try {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw new Error('Failed to update expense record');
    }
  },

  deleteExpense: async (expenseId) => {
    try {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw new Error('Failed to delete expense record');
    }
  },

  // Budgets
  getAllBudgets: async (filters = {}) => {
    try {
      // For now, return mock data
      return mockBudgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw new Error('Failed to fetch budget records');
    }
  },

  createBudget: async (budgetData) => {
    try {
      // For now, just add to mock data
      const newBudget = {
        id: String(mockBudgets.length + 1),
        ...budgetData
      };
      mockBudgets.push(newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw new Error('Failed to create budget record');
    }
  },

  updateBudget: async (budgetId, budgetData) => {
    try {
    const response = await api.put(`/budgets/${budgetId}`, budgetData);
    return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw new Error('Failed to update budget record');
    }
  },

  deleteBudget: async (budgetId) => {
    try {
    const response = await api.delete(`/budgets/${budgetId}`);
    return response.data;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw new Error('Failed to delete budget record');
    }
  },

  // Financial Summary
  getFinancialSummary: async (filters = {}) => {
    try {
      // Calculate summary from mock data
      const totalIncome = mockIncome.reduce((sum, income) => sum + income.amount, 0);
      const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        expensesByCategory: mockExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {}),
        incomeBySource: mockIncome.reduce((acc, income) => {
          acc[income.type] = (acc[income.type] || 0) + income.amount;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      throw new Error('Failed to fetch financial summary');
    }
  },

  // Income Tracking
  recordIncome: async (incomeData) => {
    try {
      const response = await api.post('/income', incomeData);
      return response.data;
    } catch (error) {
      console.error('Error recording income:', error);
      throw new Error('Failed to record income');
    }
  },

  getIncome: async (startDate, endDate) => {
    try {
      const response = await api.get('/income', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching income:', error);
      throw new Error('Failed to fetch income records');
    }
  },

  // Expense Tracking
  recordExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      console.error('Error recording expense:', error);
      throw new Error('Failed to record expense');
    }
  },

  getExpenses: async (startDate, endDate) => {
    try {
      const response = await api.get('/expenses', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expense records');
    }
  },

  // Budget Management
  getBudgets: async (period) => {
    try {
      const response = await api.get('/budgets', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw new Error('Failed to fetch budgets');
    }
  },

  // Financial Reports
  generateIncomeVsExpenseReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/reports/income-vs-expense', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  },

  generateBudgetAdherenceReport: async (period) => {
    try {
      const response = await api.get('/reports/budget-adherence', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating budget report:', error);
      throw new Error('Failed to generate budget report');
    }
  },

  // Export Reports
  exportReport: async (reportData, format) => {
    try {
      const response = await api.post('/reports/export', {
        data: reportData,
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }
};

// Helper function to group transactions by category
const groupByCategory = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category || transaction.type;
    if (!groups[category]) {
      groups[category] = 0;
    }
    groups[category] += transaction.amount;
    return groups;
  }, {});
}; 