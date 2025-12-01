import { AxiosInstance } from "axios";
import { store } from "../store";
import { logout } from "../features/auth/authSlice";
import axios from "axios";

export const setupInterceptors = (api: AxiosInstance) => {
  // Request interceptor - thêm token
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.userToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const msg =
          (
            error.response?.data as { message?: string }
          )?.message?.toLowerCase() ?? "";

        if (status === 401 || msg.includes("expired")) {
          store.dispatch(logout());
          window.location.href = "/signin";
        }
      }

      return Promise.reject(error);
    }
  );
};
