import client from "./client";

export interface KindeUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : "http://127.0.0.1:8000/api";

console.log("Base URL [1]: ", BASE_URL);

export const getUser = async (): Promise<KindeUser | null> => {
  try {
    const res = await client.get<KindeUser>("/user");
    return res.data;
  } catch {
    return null;
  }
};

export const redirectToLogin = () => {
  window.location.href = `${BASE_URL}/login`;
};

export const redirectToRegister = () => {
  window.location.href = `${BASE_URL}/register`;
};

export const redirectToLogout = () => {
  window.location.href = `${BASE_URL}/logout`;
};
