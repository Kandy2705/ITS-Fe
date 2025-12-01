import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const tokenFromStorage = localStorage.getItem("accessToken");
const userFromStorage = localStorage.getItem("user");

interface IAuthState {
  userInfo: unknown;
  userToken: string | null;
  success: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: IAuthState = {
  userInfo: userFromStorage ? JSON.parse(userFromStorage) : null,
  userToken: tokenFromStorage ? tokenFromStorage : null,
  success: false,
  error: null,
  loading: false,
};

interface IUserLogin {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: IUserLogin, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", credentials);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      const userInfo = {
        email: action.payload.data.email,
        firstName: action.payload.data.firstName,
        lastName: action.payload.data.lastName,
        role: action.payload.data.role,
      };

      state.loading = false;
      state.userInfo = userInfo;
      state.userToken = action.payload.token;
      state.success = true;

      localStorage.setItem("accessToken", action.payload.data.token);
      localStorage.setItem("user", JSON.stringify(userInfo));
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload.message ?? "Login failed";
    });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
