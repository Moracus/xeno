/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    let user;
    if (localStorage.getItem("user") != "undefined") {
      user = JSON.parse(localStorage.getItem("user"));
    }
    return token && user ? { token, user } : null;
  });
  const [loading, setLoading] = useState(false);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
      "Content-Type": "application/json",
    },
  };
  useEffect(() => {
    if (auth) {
      localStorage.setItem("token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [auth]);
  const login = (token, user) => {
    setAuth({ token, user });
  };
  const logout = () => {
    console.log("logged out");
    setAuth(null);
  };
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authConfig,
        login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
