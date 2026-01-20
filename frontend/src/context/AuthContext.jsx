import React, { createContext, useContext, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL,
      uid: result.user.uid,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
