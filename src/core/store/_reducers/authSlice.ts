import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  guestAccessToken: string | null;
  guestRefreshToken: string | null;
  isSignedIn: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  guestAccessToken: null,
  guestRefreshToken: null,
  isSignedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isSignedIn = true;
    },
    setGuestTokens: (
      state,
      action: PayloadAction<{
        guestAccessToken: string;
        guestRefreshToken: string;
      }>,
    ) => {
      state.guestAccessToken = action.payload.guestAccessToken;
      state.guestRefreshToken = action.payload.guestRefreshToken;
    },
    clearTokens: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isSignedIn = false;
    },
  },
});

export const { setAuthTokens, setGuestTokens, clearTokens } = authSlice.actions;

export default authSlice;
