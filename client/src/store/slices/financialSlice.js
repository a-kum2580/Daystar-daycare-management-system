import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  income: [],
  expenses: [],
  loading: false,
  error: null,
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    setIncome: (state, action) => {
      state.income = action.payload;
      state.loading = false;
      state.error = null;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
      state.error = null;
    },
    addIncome: (state, action) => {
      state.income.push(action.payload);
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    updateIncome: (state, action) => {
      const index = state.income.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.income[index] = action.payload;
      }
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteIncome: (state, action) => {
      state.income = state.income.filter(i => i.id !== action.payload);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setIncome,
  setExpenses,
  addIncome,
  addExpense,
  updateIncome,
  updateExpense,
  deleteIncome,
  deleteExpense,
  setLoading,
  setError,
} = financialSlice.actions;

export default financialSlice.reducer; 