import { createContext, useContext, useState } from "react";
import { FEED_USERS, getFeedUserById } from "@/data/feedUsers.js";

const FBAuthContext = createContext(null);

// ── Notification helpers ──────────────────────────────────────────────
export function pushNotification(targetUserId, notif) {
  // Stores notifications keyed by user id so every user has their own inbox
  const key = `fb_notifications_${targetUserId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [{ ...notif, id: Date.now().toString(), read: false, time: "Just now" }, ...existing].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch { /* noop */ }
}

export function loadNotificationsForUser(userId) {
  try { return JSON.parse(localStorage.getItem(`fb_notifications_${userId}`) || "[]"); } catch { return []; }
}

export function markAllRead(userId) {
  const key = `fb_notifications_${userId}`;
  try {
    const notifs = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify(notifs.map(n => ({ ...n, read: true }))));
  } catch { /* noop */ }
}
// ─────────────────────────────────────────────────────────────────────

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
      is_banned: false,
      created_date: new Date().toISOString(),
    };
    // First ever account becomes admin
    if (accounts.length === 0) newAccount.is_admin = true;
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
    if (!user) return { success: false, error: "No account found with these credentials. Please create an account first." };
    if (user.is_banned) return { success: false, error: "This account has been suspended. Please contact support." };
    localStorage.setItem("fbCurrentUser", JSON.stringify(user));
    setCurrentUser(user);
    return { success: true };
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

  // Follow / unfollow a user and push a notification to them
  const followUser = (targetUserId) => {
    if (!currentUser) return;
    const followKey = `fb_following_${currentUser.id}`;
    const following = JSON.parse(localStorage.getItem(followKey) || "[]");
    const alreadyFollowing = following.includes(targetUserId);

    if (alreadyFollowing) {
      // Unfollow
      const updated = following.filter(id => id !== targetUserId);
      localStorage.setItem(followKey, JSON.stringify(updated));
      updateCurrentUser({ following: Math.max(0, (currentUser.following || 0) - 1) });
      // Decrement target's followers
      adminUpdateUser(targetUserId, {});
    } else {
      // Follow
      following.push(targetUserId);
      localStorage.setItem(followKey, JSON.stringify(following));
      updateCurrentUser({ following: (currentUser.following || 0) + 1 });
      // Increment target followers
      const accounts = getAccounts();
      const tIdx = accounts.findIndex(a => a.id === targetUserId);
      if (tIdx !== -1) {
        accounts[tIdx] = { ...accounts[tIdx], followers: (accounts[tIdx].followers || 0) + 1 };
        saveAccounts(accounts);
        if (currentUser.id === targetUserId) {
          localStorage.setItem("fbCurrentUser", JSON.stringify(accounts[tIdx]));
          setCurrentUser(accounts[tIdx]);
        }
      }
      // Push notification to target
      pushNotification(targetUserId, {
        type: "follow",
        text: `${currentUser.firstName} ${currentUser.lastName} started following you.`,
        avatar: currentUser.profilePicture || null,
        avatarInitial: currentUser.firstName?.[0] || "?",
        avatarColor: "bg-[#1877F2]",
        actorName: `${currentUser.firstName} ${currentUser.lastName}`,
        icon: "👤",
      });
    }

    return !alreadyFollowing;
  };

  const isFollowing = (targetUserId) => {
    if (!currentUser) return false;
    const followKey = `fb_following_${currentUser.id}`;
    const following = JSON.parse(localStorage.getItem(followKey) || "[]");
    return following.includes(targetUserId);
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

  const adminUpdateUser = (userId, updates) => {
    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates };
      saveAccounts(accounts);
      if (currentUser?.id === userId) {
        localStorage.setItem("fbCurrentUser", JSON.stringify(accounts[idx]));
        setCurrentUser(accounts[idx]);
      }
    }
  };

  return (
    <FBAuthContext.Provider value={{
      currentUser, register, login, logout,
      updateCurrentUser, getAllUsers, getUserById, searchUsers,
      adminUpdateUser, followUser, isFollowing,
    }}>
      {children}
    </FBAuthContext.Provider>
  );
}

export function useFBAuth() {
  return useContext(FBAuthContext);
}