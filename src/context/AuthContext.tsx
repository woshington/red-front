import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import type { LoginRequest, UserCreate } from "../types/auth";

interface User {
  id: string;
  role: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  registerAdmin: (data: Omit<UserCreate, "role">) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStoragedData = () => {
      const storagedToken = localStorage.getItem("token");
      if (storagedToken) {
        const decoded = parseJwt(storagedToken);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.sub, role: decoded.role });
        } else {
          // Token is expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };

    loadStoragedData();

    const handleUnauthorized = () => {
      setUser(null);
      navigate("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    localStorage.setItem("token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);

    const decoded = parseJwt(response.access_token);
    if (decoded) {
      setUser({ id: decoded.sub, role: decoded.role });
      navigate("/");
    }
  };

  const registerAdmin = async (data: Omit<UserCreate, "role">) => {
    await authService.register({ ...data, role: "ADMIN" });
    // Auto-login after registration
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    // Optionally call backend logout
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      authService.logout(refreshToken).catch(console.error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        registerAdmin,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
