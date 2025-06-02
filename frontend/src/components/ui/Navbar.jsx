import { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);
  const user = auth?.user;
  const userAvatar = `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${auth?.user?.email}&radius=50`;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-lg">
      <div className="text-2xl font-bold tracking-tight">
        <NavLink
          to="/dashboard"
          className="hover:text-blue-400 transition-colors"
        >
          Xeno
        </NavLink>
      </div>
      <div className="flex items-center gap-8">
        {user && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-400 underline" : "text-gray-200"
                } hover:text-blue-400 transition-colors`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/campaign-history"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-400 underline" : "text-gray-200"
                } hover:text-blue-400 transition-colors`
              }
            >
              Previous Campaigns
            </NavLink>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <img
                  src={userAvatar}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-400 hover:border-blue-500 transition-colors"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl py-2 z-10 transform transition-all duration-200 ease-in-out">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 overflow-hidden">
                    {user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
