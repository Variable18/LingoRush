import { createContext, useContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("lingorush_user");
    return saved ? JSON.parse(saved) : null;
  });

  const generateDefaultName = () => `user${Date.now()}`;

  const updateProfile = async (updates) => {
     try {
       const token = localStorage.getItem("lingorush_token");
        // Optimistic update
       setUser(prev => {
         const newUser = { ...prev, ...updates };
         localStorage.setItem("lingorush_user", JSON.stringify(newUser));
         return newUser;
       });

       if (token) {
           // If we have a backend, call it
           const res = await fetch(`http://localhost:5000/api/v1/auth/profile`, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify(updates)
           });
           const data = await res.json();
           if (data.success && data.user) {
               setUser(data.user);
               localStorage.setItem("lingorush_user", JSON.stringify(data.user));
           }
       }
     } catch (e) {
         console.error("Failed to sync profile update", e);
     }
  };

  const syncUser = async () => {
      try {
          const token = localStorage.getItem("lingorush_token");
          if (!token) return;

          const res = await fetch(`http://localhost:5000/api/v1/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem("lingorush_user", JSON.stringify(data.user));
          }
      } catch (e) {
          console.error("Failed to sync user", e);
      }
  };

  const signInWithGoogle = async () => {
    // Placeholder implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { name: "User", email: "user@example.com" };
        setUser(mockUser);
        localStorage.setItem("lingorush_token", "mock_token");
        localStorage.setItem("lingorush_user", JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  const signInWithGithub = async () => {
    // Placeholder implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { name: "Dev", email: "dev@example.com" };
        setUser(mockUser);
        localStorage.setItem("lingorush_token", "mock_token");
        localStorage.setItem("lingorush_user", JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  const signupWithEmail = async ({ name, email, password }) => {
    // Create account, then login to obtain token and user
    await api.signup({ name, email, password });
    const { token, user: loggedInUser } = await api.login({ email, password });
    setUser(loggedInUser);
    localStorage.setItem("lingorush_token", token);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lingorush_token");
    localStorage.removeItem("lingorush_user");
  };

  return (
    <AuthContext.Provider value={{ user, updateProfile, syncUser, signInWithGoogle, signInWithGithub, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
