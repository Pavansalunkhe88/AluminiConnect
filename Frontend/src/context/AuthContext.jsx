import React, { createContext, useState, useEffect } from "react";
import { socket, connectSocket } from "../api/socket";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastPath, setLastPath] = useState(null);

  // Socket connection setup — use local user state, not useAuth hook (which causes circular dependency)
  useEffect(() => {
    if (!user) return;

    // Ensure socket is connected with current token
    connectSocket(localStorage.getItem("token"));

    socket.on("connect", () => {
      socket.emit("join", user._id);
      console.log("⚡ Joined socket room:", user._id);
    });

    return () => {
      socket.off("connect");
    };
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      // DESTRUCTURING HERE ENSURES PROFILE IMAGE STAYS
      setUser({
        ...parsed,
        profileImage: parsed.profileImage || null,
      });
    }
    if (storedPath) {
      setLastPath(storedPath);
    }
    setLoading(false);
  }, []);

  // const login = (userData) => {
  //   setUser(userData);
  //   localStorage.setItem('user', JSON.stringify(userData));
  // };

  const login = (userData) => {
    console.log("SAVING USER IN AUTHCONTEXT →", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateLastPath,
    lastPath,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
