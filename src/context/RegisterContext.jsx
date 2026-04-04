import { createContext, useContext, useState } from "react";
import { base44 } from "@/api/base44Client";

const RegisterContext = createContext(null);

export function RegisterProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fbRegister") || "{}");
    } catch {
      return {};
    }
  });

  const update = (newData) => {
    setData(prev => {
      const merged = { ...prev, ...newData };
      localStorage.setItem("fbRegister", JSON.stringify(merged));
      return merged;
    });
  };

  // Called at WelcomeStep to finalize and save the account
  const finalizeRegistration = async (profileData) => {
    try {
      const allUsers = await base44.entities.User.list();
      const baseUsername = `${(profileData.firstName || "").toLowerCase()}${(profileData.lastName || "").toLowerCase()}`.replace(/\s+/g, "");
      const suffix = Date.now().toString().slice(-4);
      const autoUsername = profileData.username || (baseUsername ? `${baseUsername}${suffix}` : `user${suffix}`);
      
      const newUser = await base44.entities.User.create({
        ...profileData,
        username: autoUsername,
        followers: 0,
        following: 0,
        likes: 0,
        is_verified: false,
        is_admin: allUsers.length === 0,
        is_banned: false,
      });
      
      localStorage.setItem("fbCurrentUser", JSON.stringify(newUser));
      localStorage.removeItem("fbRegister");
      return newUser;
    } catch (error) {
      console.error("Finalize registration error:", error);
      throw error;
    }
  };

  return (
    <RegisterContext.Provider value={{ data, update, finalizeRegistration }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}