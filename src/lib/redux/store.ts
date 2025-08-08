// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './slices/userProfileSlice'; // Path to your slice

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userProfileReducer, // Your user profile slice
      // Add other reducers here if you have more slices (e.g., cart, auth)
    },
    // devTools is true by default in development, false in production
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Define types for RootState and AppDispatch for type safety
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];