import { createSlice } from '@reduxjs/toolkit';
import { authType } from 'models/auth.model';
import { RootState } from 'redux/store';

const initialState: authType = {
  me: {},
  loading: false,

  loadingGetProfile: false,
  loadingUpdate: false,
  loadingChangePass: false,
  authVerifier: false,
  msg: '',
};

export const usersSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginPending(state) {
      state.loading = true;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.msg = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    // Profile
    getProfilePending(state) {
      state.loadingGetProfile = true;
    },
    getProfileSuccess(state, action) {
      state.loadingGetProfile = false;
      state.me = action.payload;
    },
    getProfileFailed(state) {
      state.loadingGetProfile = false;
      state.me = {};
    },

    // Update Profile
    updateProfilePending(state) {
      state.loadingUpdate = true;
    },
    updateProfileSuccess(state, action) {
      state.loadingUpdate = false;
      state.me = action.payload;
    },
    updateProfileFailed(state) {
      state.loadingUpdate = false;
      state.me = {};
    },

    // Change Password
    changePasswordPending(state) {
      state.loadingChangePass = true;
    },
    changePasswordSuccess(state) {
      state.loadingChangePass = false;
    },
    changePasswordFailed(state) {
      state.loadingChangePass = false;
    },

    // Validation Token
    validationTokenPending(state) {
      state.authVerifier = false;
    },

    validationTokenSuccess(state) {
      state.authVerifier = true;
    },

    validationTokenFailed(state) {
      state.authVerifier = false;
    },

    // Verify Auth
    verifyAuth(state) {
      state.authVerifier = true;
    },

    failedAuth(state) {
      state.authVerifier = false;
    },
  },
});

export const {
  // Login
  loginPending,
  setLoading,
  loginFailed,

  // Profile
  getProfilePending,
  getProfileSuccess,
  getProfileFailed,

  // Update Profile
  updateProfilePending,
  updateProfileSuccess,
  updateProfileFailed,

  // Change Password
  changePasswordPending,
  changePasswordSuccess,
  changePasswordFailed,

  // Validate Token
  validationTokenSuccess,
  validationTokenPending,
  validationTokenFailed,

  // Verify Auth
  verifyAuth,
  failedAuth,
} = usersSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export default usersSlice.reducer;
