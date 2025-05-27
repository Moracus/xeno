import { GoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { login } = useContext(AuthContext);

  const googleLogin = async () => {
    try {
      const token = queryParams.get("token");
      const error = queryParams.get("error");

      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const user = decodedToken.user;
        login(token, user);
        navigate(`/dashboard`); // Redirect to dashboard
      } else if (error) {
        alert("Google login failed");
        navigate("/"); // Redirect to login
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  useEffect(() => {
    googleLogin();
  }, [location, navigate]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            alert("Login failed");
            console.error("Login Failed");
          }}
          login_uri={`${backendUrl}/api/auth/`}
          ux_mode="redirect"
        />
      </div>
    </div>
  );
};

export default LoginPage;
