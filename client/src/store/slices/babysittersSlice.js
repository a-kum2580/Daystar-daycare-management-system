import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  babysitters: [],
  loading: false,
  error: null,
};

const babysittersSlice = createSlice({
  name: 'babysitters',
  initialState,
  reducers: {
    setBabysitters: (state, action) => {
      state.babysitters = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBabysitter: (state, action) => {
      state.babysitters.push(action.payload);
    },
    updateBabysitter: (state, action) => {
      const index = state.babysitters.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.babysitters[index] = action.payload;
      }
    },
    deleteBabysitter: (state, action) => {
      state.babysitters = state.babysitters.filter(b => b.id !== action.payload);
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
  setBabysitters,
  addBabysitter,
  updateBabysitter,
  deleteBabysitter,
  setLoading,
  setError,
} = babysittersSlice.actions;

export default babysittersSlice.reducer; 