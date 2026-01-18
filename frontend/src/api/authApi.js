import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function sendOTP(email) {
  try {
    const response = await api.post("/auth/send-otp", {
      email,
    });
    const data = response.data;
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function verifyOTP(email, otp) {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });
    const data = response.data;
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
