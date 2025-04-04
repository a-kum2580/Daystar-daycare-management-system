import { create } from 'zustand';
import brain from 'brain';
import { toast } from 'sonner';

// Type definitions for financial data
export interface Income {
  id: string;
  date: string; // ISO date string
  amount: number;
  source: 'child_session' | 'donation' | 'grant' | 'other';
  child_id?: string;
  session_type?: 'half-day' | 'full-day';
  description?: string;
  created_by?: string;
  created_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  created_at?: string;
}

export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category_id: string;
  payee: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'check' | 'other';
  description?: string;
  receipt_url?: string;
  created_by?: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  year: number;
  month: number;
  category_id: string;
  amount: number;
  created_at?: string;
  notes?: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_income: number;
  expenses_by_category: Record<string, number>;
  income_by_source: Record<string, number>;
  budget_status: Record<string, {
    budgeted: number;
    spent: number;
    remaining: number;
    percentage_used: number;
  }>;
}

interface FinancialFilter {
  start_date?: string;
  end_date?: string;
  category_id?: string;
  year?: number;
  month?: number;
}

interface FinancialState {
  // Data
  incomes: Income[];
  expenses: Expenses[];
  categories: ExpenseCategory[];
  budgets: Budget[];
  summary: FinancialSummary | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions - Income
  fetchIncomes: (filter?: FinancialFilter) => Promise<Income[]>;
  createIncome: (income: Omit<Income, 'id' | 'created_at'>) => Promise<Income | null>;
  updateIncome: (id: string, income: Partial<Income>) => Promise<Income | null>;
  deleteIncome: (id: string) => Promise<boolean>;
  
  // Actions - Categories
  fetchCategories: () => Promise<ExpenseCategory[]>;
  createCategory: (category: Omit<ExpenseCategory, 'id' | 'created_at'>) => Promise<ExpenseCategory | null>;
  updateCategory: (id: string, category: Partial<ExpenseCategory>) => Promise<ExpenseCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Actions - Expenses
  fetchExpenses: (filter?: FinancialFilter) => Promise<Expense[]>;
  createExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<Expense | null>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<Expense | null>;
  deleteExpense: (id: string) => Promise<boolean>;
  
  // Actions - Budgets
  fetchBudgets: (filter?: FinancialFilter) => Promise<Budget[]>;
  createBudget: (budget: Omit<Budget, 'id' | 'created_at'>) => Promise<Budget | null>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  
  // Actions - Summary
  fetchFinancialSummary: (filter?: FinancialFilter) => Promise<FinancialSummary | null>;
}

const useFinancialStore = create<FinancialState>((set, get) => ({
  // Initial state
  incomes: [],
  expenses: [],
  categories: [],
  budgets: [],
  summary: null,
  isLoading: false,
  error: null,
  
  // Actions - Income
  fetchIncomes: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      // Build query params
      const queryParams: any = {};
      if (filter?.start_date) queryParams.start_date = filter.start_date;
      if (filter?.end_date) queryParams.end_date = filter.end_date;
      
      const response = await brain.get_all_income(queryParams);
      const data = await response.json();
      set({ incomes: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching incomes:', error);
      set({ error: 'Failed to fetch income records', isLoading: false });
      toast.error('Failed to fetch income records');
      return [];
    }
  },
  
  createIncome: async (income) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_income(income);
      const newIncome = await response.json();
      set(state => ({
        incomes: [...state.incomes, newIncome],
        isLoading: false
      }));
      toast.success('Income added successfully');
      return newIncome;
    } catch (error) {
      console.error('Error creating income:', error);
      set({ error: 'Failed to add income', isLoading: false });
      toast.error('Failed to add income');
      return null;
    }
  },
  
  updateIncome: async (id, incomeUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_income({ income_id: id }, incomeUpdate);
      const updatedIncome = await response.json();
      set(state => ({
        incomes: state.incomes.map(income => 
          income.id === id ? updatedIncome : income
        ),
        isLoading: false
      }));
      toast.success('Income updated successfully');
      return updatedIncome;
    } catch (error) {
      console.error('Error updating income:', error);
      set({ error: 'Failed to update income', isLoading: false });
      toast.error('Failed to update income');
      return null;
    }
  },
  
  deleteIncome: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_income({ income_id: id });
      set(state => ({
        incomes: state.incomes.filter(income => income.id !== id),
        isLoading: false
      }));
      toast.success('Income deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting income:', error);
      set({ error: 'Failed to delete income', isLoading: false });
      toast.error('Failed to delete income');
      return false;
    }
  },
  
  // Actions - Categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_expense_categories();
      const data = await response.json();
      set({ categories: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to fetch expense categories', isLoading: false });
      toast.error('Failed to fetch expense categories');
      return [];
    }
  },
  
  createCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_expense_category(category);
      const newCategory = await response.json();
      set(state => ({
        categories: [...state.categories, newCategory],
        isLoading: false
      }));
      toast.success('Category added successfully');
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      set({ error: 'Failed to add category', isLoading: false });
      toast.error('Failed to add category');
      return null;
    }
  },
  
  updateCategory: async (id, categoryUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_expense_category({ category_id: id }, categoryUpdate);
      const updatedCategory = await response.json();
      set(state => ({
        categories: state.categories.map(category => 
          category.id === id ? updatedCategory : category
        ),
        isLoading: false
      }));
      toast.success('Category updated successfully');
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: 'Failed to update category', isLoading: false });
      toast.error('Failed to update category');
      return null;
    }
  },
  
  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_expense_category({ category_id: id });
      set(state => ({
        categories: state.categories.filter(category => category.id !== id),
        isLoading: false
      }));
      toast.success('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: 'Failed to delete category', isLoading: false });
      toast.error('Failed to delete category');
      return false;
    }
  },
  
  // Actions - Expenses
  fetchExpenses: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      // Build query params
      const queryParams: any = {};
      if (filter?.start_date) queryParams.start_date = filter.start_date;
      if (filter?.end_date) queryParams.end_date = filter.end_date;
      if (filter?.category_id) queryParams.category_id = filter.category_id;
      
      const response = await brain.get_all_expenses_endpoint(queryParams);
      const data = await response.json();
      set({ expenses: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      set({ error: 'Failed to fetch expense records', isLoading: false });
      toast.error('Failed to fetch expense records');
      return [];
    }
  },
  
  createExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_expense(expense);
      const newExpense = await response.json();
      set(state => ({
        expenses: [...state.expenses, newExpense],
        isLoading: false
      }));
      toast.success('Expense added successfully');
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      set({ error: 'Failed to add expense', isLoading: false });
      toast.error('Failed to add expense');
      return null;
    }
  },
  
  updateExpense: async (id, expenseUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_expense({ expense_id: id }, expenseUpdate);
      const updatedExpense = await response.json();
      set(state => ({
        expenses: state.expenses.map(expense => 
          expense.id === id ? updatedExpense : expense
        ),
        isLoading: false
      }));
      toast.success('Expense updated successfully');
      return updatedExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      set({ error: 'Failed to update expense', isLoading: false });
      toast.error('Failed to update expense');
      return null;
    }
  },
  
  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_expense({ expense_id: id });
      set(state => ({
        expenses: state.expenses.filter(expense => expense.id !== id),
        isLoading: false
      }));
      toast.success('Expense deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      set({ error: 'Failed to delete expense', isLoading: false });
      toast.error('Failed to delete expense');
      return false;
    }
  },
  
  // Actions - Budgets
  fetchBudgets: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      // Build query params
      const queryParams: any = {};
      if (filter?.year) queryParams.year = filter.year;
      if (filter?.month) queryParams.month = filter.month;
      if (filter?.category_id) queryParams.category_id = filter.category_id;
      
      const response = await brain.get_budgets(queryParams);
      const data = await response.json();
      set({ budgets: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      set({ error: 'Failed to fetch budget records', isLoading: false });
      toast.error('Failed to fetch budget records');
      return [];
    }
  },
  
  createBudget: async (budget) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_budget(budget);
      const newBudget = await response.json();
      set(state => ({
        budgets: [...state.budgets, newBudget],
        isLoading: false
      }));
      toast.success('Budget added successfully');
      return newBudget;
    } catch (error) {
      console.error('Error creating budget:', error);
      set({ error: 'Failed to add budget', isLoading: false });
      toast.error('Failed to add budget');
      return null;
    }
  },
  
  updateBudget: async (id, budgetUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_budget({ budget_id: id }, budgetUpdate);
      const updatedBudget = await response.json();
      set(state => ({
        budgets: state.budgets.map(budget => 
          budget.id === id ? updatedBudget : budget
        ),
        isLoading: false
      }));
      toast.success('Budget updated successfully');
      return updatedBudget;
    } catch (error) {
      console.error('Error updating budget:', error);
      set({ error: 'Failed to update budget', isLoading: false });
      toast.error('Failed to update budget');
      return null;
    }
  },
  
  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_budget({ budget_id: id });
      set(state => ({
        budgets: state.budgets.filter(budget => budget.id !== id),
        isLoading: false
      }));
      toast.success('Budget deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting budget:', error);
      set({ error: 'Failed to delete budget', isLoading: false });
      toast.error('Failed to delete budget');
      return false;
    }
  },
  
  // Actions - Summary
  fetchFinancialSummary: async (filter) => {
    set({ isLoading: true, error: null });
    try {
      // Build query params
      const queryParams: any = {};
      if (filter?.start_date) queryParams.start_date = filter.start_date;
      if (filter?.end_date) queryParams.end_date = filter.end_date;
      
      const response = await brain.get_financial_summary(queryParams);
      const data = await response.json();
      set({ summary: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      set({ error: 'Failed to fetch financial summary', isLoading: false });
      toast.error('Failed to fetch financial summary');
      return null;
    }
  }
}));

export default useFinancialStore;
