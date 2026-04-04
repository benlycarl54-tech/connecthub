import { createContext, useContext, useState } from "react";

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
  const finalizeRegistration = (profileData) => {
    const accounts = (() => {
      try { return JSON.parse(localStorage.getItem("fbAccounts") || "[]"); } catch { return []; }
    })();
    const id = Date.now().toString();
    // First ever account becomes admin automatically
    const isFirstAccount = accounts.length === 0;
    // Auto-generate username from first+last name + short id suffix
    const baseUsername = `${(profileData.firstName || "").toLowerCase()}${(profileData.lastName || "").toLowerCase()}`.replace(/\s+/g, "");
    const suffix = id.slice(-4);
    const autoUsername = profileData.username || (baseUsername ? `${baseUsername}${suffix}` : `user${suffix}`);
    const newAccount = {
      id,
      ...profileData,
      username: autoUsername,
      followers: 0,
      following: 0,
      likes: 0,
      is_verified: false,
      is_admin: isFirstAccount,
      created_date: new Date().toISOString(),
    };
    accounts.push(newAccount);
    localStorage.setItem("fbAccounts", JSON.stringify(accounts));
    localStorage.setItem("fbCurrentUser", JSON.stringify(newAccount));
    return newAccount;
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