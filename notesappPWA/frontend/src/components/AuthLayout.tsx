import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "../services/authService";
import Header from "../layout/Header";

export default function AuthLayout() {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    // Redireccionar a /login, pero guardar la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
