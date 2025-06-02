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
  const { login, auth } = useContext(AuthContext);
  const authorised = auth?.token;

  const googleLogin = async () => {
    try {
      const token = queryParams.get("token");
      const error = queryParams.get("error");

      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const user = decodedToken.user;
        login(token, user);
        navigate(`/dashboard`);
      } else if (error) {
        alert("Google login failed");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  useEffect(() => {
    if (authorised) {
      navigate("/dashboard");
    }
    googleLogin();
  }, [location, navigate]);

  return (
    <div className="flex-1 h-full flex items-center justify-center ">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to Xeno
        </h1>
        <p className="text-gray-600 mb-8">
          Sign in to access your CRM dashboard
        </p>
        <div className="flex justify-center">
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
            theme="filled_blue"
            size="large"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
