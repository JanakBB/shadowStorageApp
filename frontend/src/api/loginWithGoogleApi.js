import { api } from "./authApi.js";

export async function loginWithGoogle(idToken) {
  try {
    const response = await api.post("/auth/google", { credential: idToken });
    const data = response.data;
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
