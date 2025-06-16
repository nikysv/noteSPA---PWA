import axios from "axios";
import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_URL}/notes`;

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

import type { Tag } from "./tagService";

type Note = {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags?: Tag[];
};

type UpdateNoteData = Partial<Omit<Note, "id">>;

const STORAGE_KEYS = {
  NOTES: "cached_notes",
  PENDING_CHANGES: "pending_changes",
};

export const getNotes = async () => {
  try {
    const res = await api.get("/");
    // Almacenar en cache cuando la petición es exitosa
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    // Si hay un error (sin conexión), intentar usar datos en caché
    const cachedData = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    throw error;
  }
};

export const createNote = async (data: {
  title: string;
  content: string;
  tags?: number[];
}) => {
  try {
    const res = await api.post("/", data);
    // Actualizar caché con la nueva nota
    const cachedNotes = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
    );
    cachedNotes.unshift(res.data);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(cachedNotes));
    return res.data;
  } catch (error) {
    if (!navigator.onLine) {
      // Crear una nota temporal para modo offline
      const tempNote = {
        id: Date.now(), // ID temporal
        ...data,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en caché
      const cachedNotes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
      );
      cachedNotes.unshift(tempNote);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(cachedNotes));

      // Guardar para sincronización posterior
      const pendingChanges = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES) || "[]"
      );
      pendingChanges.push({ type: "create", data: tempNote });
      localStorage.setItem(
        STORAGE_KEYS.PENDING_CHANGES,
        JSON.stringify(pendingChanges)
      );

      return tempNote;
    }
    throw error;
  }
};

export const deleteNote = async (id: number) => {
  try {
    await api.delete(`/${id}`);
    // Actualizar caché eliminando la nota
    const cachedNotes = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
    );
    const updatedNotes = cachedNotes.filter((note: Note) => note.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
  } catch (error) {
    if (!navigator.onLine) {
      // Actualizar caché en modo offline
      const cachedNotes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
      );
      const updatedNotes = cachedNotes.filter((note: Note) => note.id !== id);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));

      // Guardar para sincronización posterior
      const pendingChanges = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES) || "[]"
      );
      pendingChanges.push({ type: "delete", id });
      localStorage.setItem(
        STORAGE_KEYS.PENDING_CHANGES,
        JSON.stringify(pendingChanges)
      );
      return;
    }
    throw error;
  }
};

export const updateNote = async (id: number, data: UpdateNoteData) => {
  try {
    const { data: updatedNote } = await api.patch(`/${id}`, data);
    // Actualizar caché
    const cachedNotes = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
    );
    const updatedNotes = cachedNotes.map((note: Note) =>
      note.id === id ? { ...note, ...updatedNote } : note
    );
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    return updatedNote;
  } catch (error) {
    if (!navigator.onLine) {
      // Actualizar caché en modo offline
      const cachedNotes = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTES) || "[]"
      );
      const updatedNotes = cachedNotes.map((note: Note) =>
        note.id === id ? { ...note, ...data } : note
      );
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));

      // Guardar para sincronización posterior
      const pendingChanges = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES) || "[]"
      );
      pendingChanges.push({ type: "update", id, data });
      localStorage.setItem(
        STORAGE_KEYS.PENDING_CHANGES,
        JSON.stringify(pendingChanges)
      );

      const updatedNote = updatedNotes.find((note: Note) => note.id === id);
      return updatedNote;
    }
    throw error;
  }
};

export const archiveNote = async (id: number) => {
  return updateNote(id, { archived: true });
};

export const unarchiveNote = async (id: number) => {
  return updateNote(id, { archived: false });
};

export const syncPendingChanges = async () => {
  if (!navigator.onLine) return;

  const pendingChanges = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES) || "[]"
  );
  if (pendingChanges.length === 0) return;

  for (const change of pendingChanges) {
    try {
      switch (change.type) {
        case "create":
          await api.post("/", change.data);
          break;
        case "update":
          await api.patch(`/${change.id}`, change.data);
          break;
        case "delete":
          await api.delete(`/${change.id}`);
          break;
      }
    } catch (error) {
      console.error("Error syncing change:", error);
    }
  }

  // Limpiar cambios pendientes después de sincronizar
  localStorage.removeItem(STORAGE_KEYS.PENDING_CHANGES);

  // Actualizar el caché con los datos más recientes del servidor
  const freshData = await api.get("/");
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(freshData.data));

  return freshData.data;
};
