import React, { useEffect, useState } from "react";
import { IUser } from "../../types/user.types";
import { AuthContext } from "../../contexts/authContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const signin = (userData: IUser, token: string) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const signout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (user: IUser) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const value = {
    user,
    token,
    signin,
    signout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
