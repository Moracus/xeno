import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);
  const user = auth?.user;
  const userAvatar = `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${auth?.user?.email}&radius=50`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 text-white flex justify-between items-center p-4">
      <div className="text-xl font-bold">Xeno</div>
      <div className="flex items-center gap-4">
        {user && user.picture && (
          <img
            src={userAvatar}
            alt="User Profile"
            className="w-8 h-8 rounded-full border border-white"
          />
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
