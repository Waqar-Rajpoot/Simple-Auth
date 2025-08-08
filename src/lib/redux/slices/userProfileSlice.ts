// lib/redux/slices/userProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// --- Types (This should match the shape of data returned by your API) ---
interface UserProfile {
  _id: string; // MongoDB's `_id` will be a string on the frontend
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt?: string; // Mongoose adds these, optional
  updatedAt?: string; // Mongoose adds these, optional
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean; // For initial fetch
  error: string | null; // For initial fetch error
  updateLoading: boolean; // For update operation loading
  updateError: string | null; // For update operation error
}

// --- Initial State ---
const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// --- Async Thunk: Fetch User Profile from API ---
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`); // Calls your Next.js API route
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile from API');
      }
      const data: UserProfile = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Async Thunk: Update User Profile via API ---
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (updatedProfileData: Partial<UserProfile> & { _id: string }, { rejectWithValue }) => {
    try {
      // Ensure _id is present for the update
      if (!updatedProfileData._id) {
          throw new Error('User ID is required to update profile.');
      }
      const response = await fetch(`/api/users`, { // PUT request to your API route
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user profile via API');
      }
      const data: UserProfile = await response.json(); // API should return the updated profile
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice Definition ---
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    // Synchronous action to clear profile (e.g., on user logout)
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
    },
    // Synchronous action to clear only update-related errors
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the lifecycle of `fetchUserProfile` thunk
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      })
      // Handle the lifecycle of `updateUserProfile` thunk
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.updateLoading = false;
        state.profile = action.payload; // Update the profile in state with the latest data from API
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearUserProfile, clearUpdateError } = userProfileSlice.actions;
export default userProfileSlice.reducer;