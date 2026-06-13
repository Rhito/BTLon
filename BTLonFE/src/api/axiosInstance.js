import axios from "axios";

// -- Config --
import { API_URL } from "@/config/app";
// -- Create Instance --

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Instance --
//Tự động đính kèm token.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sanctum_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//  Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearAuth();
    }

    return Promise.reject(buildErrorPayload(error));
  },
);

function clearAuth() {
  localStorage.removeItem("sanctum_token");
}

function buildErrorPayload(error) {
  return {
    status: error.response?.status ?? null,
    message:
      error.response?.data?.message ||
      error.response?.data?.data ||
      error.message ||
      "An unexpected error occurred",
    data: error.response?.data ?? null,
    originError: error,
  };
}

export default axiosInstance;
