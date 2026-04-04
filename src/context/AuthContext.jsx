import { createContext, useContext, useState } from "react";
import { FEED_USERS, getFeedUserById } from "@/data/feedUsers.js";

const FBAuthContext = createContext(null);

// All registered accounts stored in localStorage as "fbAccounts" array
// Current logged-in user stored as "fbCurrentUser"

export function FBAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fbCurrentUser") || "null"); } catch { return null; }
  });

  const getAccounts = () => {
    try { return JSON.parse(localStorage.getItem("fbAccounts") || "[]"); } catch { return []; }
  };

  const saveAccounts = (accounts) => {
    localStorage.setItem("fbAccounts", JSON.stringify(accounts));
  };

  const register = (profileData) => {
    const accounts = getAccounts();
    const id = Date.now().toString();
    const newAccount = {
      id,
      ...profileData,
      followers: 0,
      following: 0,
      likes: 0,
      is_verified: false,
      is_admin: false,
      created_date: new Date().toISOString(),
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    localStorage.setItem("fbCurrentUser", JSON.stringify(newAccount));
    setCurrentUser(newAccount);
    return newAccount;
  };

  const login = (identifier, password) => {
    const accounts = getAccounts();
    const user = accounts.find(a =>
      (a.emailAddress === identifier || a.mobileNumber === identifier) && a.password === password
    );
    if (user) {
      localStorage.setItem("fbCurrentUser", JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: "No account found with these credentials. Please create an account first." };
  };

  const logout = () => {
    localStorage.removeItem("fbCurrentUser");
    setCurrentUser(null);
  };

  const updateCurrentUser = (updates) => {
    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.id === currentUser?.id);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates };
      saveAccounts(accounts);
      const updated = accounts[idx];
      localStorage.setItem("fbCurrentUser", JSON.stringify(updated));
      setCurrentUser(updated);
    }
  };

  const getAllUsers = () => [...getAccounts(), ...FEED_USERS];

  const getUserById = (id) => {
    if (id && id.startsWith("feed_")) return getFeedUserById(id);
    return getAccounts().find(a => a.id === id) || null;
  };

  const searchUsers = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const accountMatches = getAccounts().filter(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.emailAddress?.toLowerCase().includes(q)
    );
    const feedMatches = FEED_USERS.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
    return [...accountMatches, ...feedMatches];
  };

  // Admin: update any user
  const adminUpdateUser = (userId, updates) => {
    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates };
      saveAccounts(accounts);
      // If editing current user, sync
      if (currentUser?.id === userId) {
        localStorage.setItem("fbCurrentUser", JSON.stringify(accounts[idx]));
        setCurrentUser(accounts[idx]);
      }
    }
  };

  return (
    <FBAuthContext.Provider value={{ currentUser, register, login, logout, updateCurrentUser, getAllUsers, getUserById, searchUsers, adminUpdateUser }}>
      {children}
    </FBAuthContext.Provider>
  );
}

export function useFBAuth() {
  return useContext(FBAuthContext);
}