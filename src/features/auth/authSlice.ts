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

export const loginUser = createAsyncThunk<
  unknown,
  IUserLogin,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post("/users/login", credentials);
    return res.data as {
      data: {
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        token: string;
      };
    };
  } catch (err) {
    const error = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      error.response?.data?.message || error.message || "Login failed";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    updateUserInfo(state, action) {
      const current =
        (state.userInfo as {
          email?: string;
          firstName?: string;
          lastName?: string;
          role?: string;
        }) ?? {};

      const updated = {
        ...current,
        ...action.payload,
      };

      state.userInfo = updated;
      localStorage.setItem("user", JSON.stringify(updated));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      const payload = action.payload as {
        data: {
          email: string;
          firstName: string;
          lastName: string;
          role: string;
          token: string;
        };
      };

      const userInfo = {
        email: payload.data.email,
        firstName: payload.data.firstName,
        lastName: payload.data.lastName,
        role: payload.data.role,
      };

      state.loading = false;
      state.userInfo = userInfo;
      // Đồng bộ cách lấy token với cấu trúc response từ backend (data.token)
      state.userToken = payload.data.token;
      state.success = true;

      localStorage.setItem("accessToken", payload.data.token);
      localStorage.setItem("user", JSON.stringify(userInfo));
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload ?? "Login failed";
    });
  },
});

export const { logout, updateUserInfo } = authSlice.actions;
export const authReducer = authSlice.reducer;
