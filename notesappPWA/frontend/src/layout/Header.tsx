import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const tabs = [
    { to: "/", label: "NOTES", color: "bg-pink-600" },
    { to: "/archived", label: "ARCHIVED", color: "bg-red-400" },
    { to: "/tags", label: "TAGS", color: "bg-purple-500" },
  ];

  return (
    <header className="shadow fixed top-0 w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <nav className="flex flex-1 text-black font-bold text-center">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex-1 py-4 transition-all ${tab.color} ${
                    isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="px-4 py-2 mr-4 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            <span>Cerrar Sesión</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2H4V5h4a1 1 0 1 0 0-2H3zm12.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 0 1 0-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
