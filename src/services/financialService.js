import api from './api.config';

export const financialService = {
  // Income Management
  getAllIncome: async (filters = {}) => {
    const response = await api.get('/income', { params: filters });
    return response.data;
  },

  createIncome: async (incomeData) => {
    const response = await api.post('/income', incomeData);
    return response.data;
  },

  updateIncome: async (incomeId, incomeData) => {
    const response = await api.put(`/income/${incomeId}`, incomeData);
    return response.data;
  },

  deleteIncome: async (incomeId) => {
    const response = await api.delete(`/income/${incomeId}`);
    return response.data;
  },

  // Expense Categories
  getAllCategories: async () => {
    const response = await api.get('/expense-categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/expense-categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/expense-categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/expense-categories/${categoryId}`);
    return response.data;
  },

  // Expenses
  getAllExpenses: async (filters = {}) => {
    const response = await api.get('/expenses', { params: filters });
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (expenseId, expenseData) => {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  deleteExpense: async (expenseId) => {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },

  // Budgets
  getAllBudgets: async (filters = {}) => {
    const response = await api.get('/budgets', { params: filters });
    return response.data;
  },

  createBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  updateBudget: async (budgetId, budgetData) => {
    const response = await api.put(`/budgets/${budgetId}`, budgetData);
    return response.data;
  },

  deleteBudget: async (budgetId) => {
    const response = await api.delete(`/budgets/${budgetId}`);
    return response.data;
  },

  // Financial Summary
  getFinancialSummary: async (filters = {}) => {
    const response = await api.get('/financial-summary', { params: filters });
    return response.data;
  }
}; 