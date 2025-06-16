import { Routes as RouterRoutes, Route } from "react-router-dom";
import Notes from "../pages/Notes";
import Archived from "../pages/Archived";
import Tags from "../pages/Tags";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../components/AuthLayout";
import { useEffect } from "react";
import { initializeAuth } from "../services/authService";

export default function Routes() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <RouterRoutes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Notes />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/tags" element={<Tags />} />
      </Route>
    </RouterRoutes>
  );
}
