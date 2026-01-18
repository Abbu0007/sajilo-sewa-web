import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(msg));
  }
);
