import { api } from "./authApi.js";

export async function registerUser(formData) {
  try {
    const response = await api.post("/user/register", formData);
    const data = response.data;
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function login(formData) {
  try {
    const response = await api.post("/user/login", formData);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
}
