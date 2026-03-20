import { createContext, useContext, useEffect, useState } from "react";
import { clearAuth, getAuth, saveAuth } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getAuth());

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  const login = (data) => {
    saveAuth(data);
    setAuth(getAuth());
  };

  const logout = () => {
    clearAuth();
    setAuth(getAuth());
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);