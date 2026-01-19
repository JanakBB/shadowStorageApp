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
