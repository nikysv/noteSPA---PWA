import axios from "axios";
import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_URL}/tags`;

// Create an instance of axios with authentication
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type Tag = {
  id: number;
  name: string;
  color: string;
  notes?: {
    id: number;
    title: string;
    content: string;
    archived: boolean;
    tags?: Tag[];
  }[];
};

export const getTags = async () => {
  const res = await api.get("/");
  return res.data;
};

export const createTag = async (data: { name: string; color: string }) => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateTag = async (id: number, data: Partial<Tag>) => {
  const res = await api.patch(`/${id}`, data);
  return res.data;
};

export const deleteTag = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Añadir una etiqueta a una nota
export const addTagToNote = async (noteId: number, tagId: number) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/notes/${noteId}/tags/${tagId}`
  );
  return res.data;
};

// Remover una etiqueta de una nota
export const removeTagFromNote = async (noteId: number, tagId: number) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/notes/${noteId}/tags/${tagId}`);
};
