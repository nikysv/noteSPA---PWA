import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
  };
}

export const setAuthToken = (token: string) => {
  if (!token) return;
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  console.log("Token set:", token); // Para debugging
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Alias for getAuthToken to match the import in tagService
export const getToken = getAuthToken;

export const removeAuthToken = () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
};

export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
    email,
    password,
  });
  setAuthToken(res.data.access_token);
  return res.data;
};

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
    email,
    password,
  });
  setAuthToken(res.data.access_token);
  return res.data;
};

export const logout = () => {
  removeAuthToken();
};
