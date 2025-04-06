import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  children: [],
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setChildren: (state, action) => {
      state.children = action.payload;
      state.loading = false;
      state.error = null;
    },
    addChild: (state, action) => {
      state.children.push(action.payload);
    },
    updateChild: (state, action) => {
      const index = state.children.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.children[index] = action.payload;
      }
    },
    deleteChild: (state, action) => {
      state.children = state.children.filter(c => c.id !== action.payload);
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
  setChildren,
  addChild,
  updateChild,
  deleteChild,
  setLoading,
  setError,
} = childrenSlice.actions;

export default childrenSlice.reducer; 