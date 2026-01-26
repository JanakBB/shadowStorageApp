import { api } from "./authApi.js";

export async function getHomeData() {
  try {
    const response = await api.get("/home-data");
    const data = response.data;
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
