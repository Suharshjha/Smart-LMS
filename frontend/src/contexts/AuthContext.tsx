// src/contexts/AuthContext.tsx
//
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { apiFetch } from "@/lib/api";
//
// export type UserRole = "ADMIN" | "LIBRARIAN" | "USER";
//
// interface User {
//   username: string;
//   role: UserRole;
//   token: string;
//   userId: number;
// }
//
// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const saved = localStorage.getItem("lms_user");
//     if (saved) setUser(JSON.parse(saved));
//   }, []);
//
//   // ----------------------------------------------------
//   // ⭐ FINAL LOGIN FUNCTION (MATCHES BACKEND EXACTLY)
//   // ----------------------------------------------------
//   const login = async (username: string, password: string) => {
//     try {
//       const result = await apiFetch("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ username, password }),
//       });
//
//       const userData: User = {
//         userId: result.userId,
//         username: result.username,
//         role: result.role,
//         token: result.token
//       };
//
//       localStorage.setItem("lms_user", JSON.stringify(userData));
//       setUser(userData);
//
//       toast.success("Login successful!");
//
//       if (userData.role === "ADMIN") navigate("/admin/dashboard");
//       if (userData.role === "LIBRARIAN") navigate("/librarian/dashboard");
//       if (userData.role === "USER") navigate("/user/dashboard");
//
//     } catch (error) {
//       toast.error("Login failed");
//     }
//   };
//
//
//   const logout = () => {
//     localStorage.removeItem("lms_user");
//     setUser(null);
//     toast.info("Logged out successfully");
//     navigate("/login");
//   };
//
//   return (
//       <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
//         {children}
//       </AuthContext.Provider>
//   );
// };
//
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

//
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { apiFetch } from "@/lib/api";
//
// export type UserRole = "ADMIN" | "LIBRARIAN" | "USER";
//
// interface User {
//   username: string;
//   role: UserRole;
//   token: string;
//   userId: number;
// }
//
// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const saved = localStorage.getItem("lms_user");
//     if (saved) setUser(JSON.parse(saved));
//   }, []);
//
//   // ⭐ FINAL CORRECT LOGIN FUNCTION
//   const login = async (username: string, password: string) => {
//     try {
//       const result = await apiFetch("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ username, password }),
//       });
//
//       // Backend sends -> userId, username, role, jwtToken
//       const userData: User = {
//         userId: result.userId,
//         username: result.username,
//         role: result.role,
//         token: result.jwtToken  // <-- IMPORTANT FIX
//       };
//
//       localStorage.setItem("lms_user", JSON.stringify(userData));
//       setUser(userData);
//
//       toast.success("Login successful!");
//
//       if (userData.role === "ADMIN") navigate("/admin/dashboard");
//       if (userData.role === "LIBRARIAN") navigate("/librarian/dashboard");
//       if (userData.role === "USER") navigate("/user/dashboard");
//
//     } catch (error) {
//       console.error("Login Error:", error);
//       toast.error("Login failed");
//     }
//   };
//
//   const logout = () => {
//     localStorage.removeItem("lms_user");
//     setUser(null);
//     toast.info("Logged out successfully");
//     navigate("/login");
//   };
//
//   return (
//       <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
//         {children}
//       </AuthContext.Provider>
//   );
// };
//
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };


// src/contexts/AuthContext.tsx


// src/contexts/AuthContext.tsx
// src/contexts/AuthContext.tsx
// src/contexts/AuthContext.tsx


// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";


export type UserRole = "ADMIN" | "LIBRARIAN" | "USER";

interface User {
  username: string;
  role: UserRole;
  token: string;
  userId: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("lms_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // ----------------------------------------------
  // ⭐ FIXED LOGIN FUNCTION — NOW STORES jwtToken ⭐
  // ----------------------------------------------
  const login = async (username: string, password: string) => {
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!result.token) {
        toast.error("Login response missing token!");
        return;
      }


      const userData: User = {
        userId: result.userId,
        username: result.username,
        role: result.role,
        token: result.token,   // <-- FIXED HERE
      };

      localStorage.setItem("lms_user", JSON.stringify(userData));
      setUser(userData);

      toast.success(`Welcome, ${userData.username}!`);

      if (userData.role === "ADMIN") navigate("/admin/dashboard");
      else if (userData.role === "LIBRARIAN") navigate("/librarian/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("lms_user");
    setUser(null);
    navigate("/login");
  };

  return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
