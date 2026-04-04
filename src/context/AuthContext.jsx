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
      const accounts = getAccounts();
      const tIdx = accounts.findIndex(a => a.id === targetUserId);
      if (tIdx !== -1) {
        accounts[tIdx] = { ...accounts[tIdx], followers: Math.max(0, (accounts[tIdx].followers || 0) - 1) };
        saveAccounts(accounts);
      }
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

  // Friend request management
  const sendFriendRequest = (targetUserId) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    const requestsKey = `fb_friend_requests_${targetUserId}`;
    const requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
    if (!requests.includes(currentUser.id)) {
      requests.push(currentUser.id);
      localStorage.setItem(requestsKey, JSON.stringify(requests));
      pushNotification(targetUserId, {
        type: "friend_request",
        text: `${currentUser.firstName} ${currentUser.lastName} sent you a friend request.`,
        avatar: currentUser.profilePicture || null,
        avatarInitial: currentUser.firstName?.[0] || "?",
        avatarColor: "bg-[#1877F2]",
        actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      });
    }
  };

  const acceptFriendRequest = (senderId) => {
    if (!currentUser) return;
    const requestsKey = `fb_friend_requests_${currentUser.id}`;
    const requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
    const updated = requests.filter(id => id !== senderId);
    localStorage.setItem(requestsKey, JSON.stringify(updated));
    
    const friendsKey = `fb_friends_${currentUser.id}`;
    const friends = JSON.parse(localStorage.getItem(friendsKey) || "[]");
    if (!friends.includes(senderId)) {
      friends.push(senderId);
      localStorage.setItem(friendsKey, JSON.stringify(friends));
    }
    
    const senderFriendsKey = `fb_friends_${senderId}`;
    const senderFriends = JSON.parse(localStorage.getItem(senderFriendsKey) || "[]");
    if (!senderFriends.includes(currentUser.id)) {
      senderFriends.push(currentUser.id);
      localStorage.setItem(senderFriendsKey, JSON.stringify(senderFriends));
    }
  };

  const declineFriendRequest = (senderId) => {
    if (!currentUser) return;
    const requestsKey = `fb_friend_requests_${currentUser.id}`;
    const requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
    const updated = requests.filter(id => id !== senderId);
    localStorage.setItem(requestsKey, JSON.stringify(updated));
  };

  const getFriendRequests = () => {
    if (!currentUser) return [];
    const requestsKey = `fb_friend_requests_${currentUser.id}`;
    const requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
    return requests.map(id => getUserById(id)).filter(Boolean);
  };

  const getFriends = () => {
    if (!currentUser) return [];
    const friendsKey = `fb_friends_${currentUser.id}`;
    const friends = JSON.parse(localStorage.getItem(friendsKey) || "[]");
    return friends.map(id => getUserById(id)).filter(Boolean);
  };

  const isFriend = (userId) => {
    if (!currentUser) return false;
    const friendsKey = `fb_friends_${currentUser.id}`;
    const friends = JSON.parse(localStorage.getItem(friendsKey) || "[]");
    return friends.includes(userId);
  };

  const hasPendingRequest = (userId) => {
    if (!currentUser) return false;
    const requestsKey = `fb_friend_requests_${currentUser.id}`;
    const requests = JSON.parse(localStorage.getItem(requestsKey) || "[]");
    return requests.includes(userId);
  };

  const getAllUsers = () => [...getAccounts(), ...FEED_USERS];

  const getUserById = (id) => {
    if (id && id.startsWith("feed_")) return getFeedUserById(id);
    return getAccounts().find(a => a.id === id) || null;
  };

  // ── Marketplace Management ──────────────────────────────────────────────
  const getMarketplaceListings = () => {
    try { return JSON.parse(localStorage.getItem("fb_marketplace") || "[]"); } catch { return []; }
  };

  const saveMarketplaceListings = (listings) => {
    localStorage.setItem("fb_marketplace", JSON.stringify(listings));
  };

  const createMarketplaceListing = (listingData) => {
    if (!currentUser) return null;
    const listings = getMarketplaceListings();
    const id = Date.now().toString();
    const newListing = {
      id,
      ...listingData,
      created_at: new Date().toISOString(),
      status: "Available",
    };
    listings.push(newListing);
    saveMarketplaceListings(listings);
    return newListing;
  };

  const getMarketplaceListingById = (listingId) => {
    const listings = getMarketplaceListings();
    return listings.find(l => l.id === listingId) || null;
  };

  const updateMarketplaceListing = (listingId, updates) => {
    const listings = getMarketplaceListings();
    const idx = listings.findIndex(l => l.id === listingId);
    if (idx !== -1) {
      listings[idx] = { ...listings[idx], ...updates };
      saveMarketplaceListings(listings);
      return listings[idx];
    }
    return null;
  };

  const createDirectMessage = (senderId, recipientId) => {
    const conversationKey = `fb_conversation_${[senderId, recipientId].sort().join("_")}`;
    const existing = JSON.parse(localStorage.getItem(conversationKey) || "null");
    if (existing) return existing;

    const conversation = {
      id: conversationKey,
      participants: [senderId, recipientId],
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(conversationKey, JSON.stringify(conversation));
    return conversation;
  };
  // ─────────────────────────────────────────────────────────────────────

  // ── Album Management ──────────────────────────────────────────────
  const getAlbums = () => {
    try { return JSON.parse(localStorage.getItem("fb_albums") || "[]"); } catch { return []; }
  };

  const saveAlbums = (albums) => {
    localStorage.setItem("fb_albums", JSON.stringify(albums));
  };

  const createAlbum = (userId, albumData) => {
    const albums = getAlbums();
    const id = Date.now().toString();
    const newAlbum = {
      id,
      user_id: userId,
      ...albumData,
      photo_count: 0,
      created_at: new Date().toISOString(),
    };
    albums.push(newAlbum);
    saveAlbums(albums);
    return newAlbum;
  };

  const getAlbumById = (albumId) => {
    const albums = getAlbums();
    return albums.find(a => a.id === albumId) || null;
  };

  const getUserAlbums = (userId) => {
    const albums = getAlbums();
    return albums.filter(a => a.user_id === userId).reverse();
  };

  const addPhotoToAlbum = (albumId, photoData) => {
    const photosKey = `fb_album_photos_${albumId}`;
    const photos = JSON.parse(localStorage.getItem(photosKey) || "[]");
    const id = Date.now().toString();
    const newPhoto = {
      id,
      ...photoData,
    };
    photos.unshift(newPhoto);
    localStorage.setItem(photosKey, JSON.stringify(photos));

    // Update album cover and count
    const albums = getAlbums();
    const idx = albums.findIndex(a => a.id === albumId);
    if (idx !== -1) {
      albums[idx] = { ...albums[idx], cover_photo: photoData.url, photo_count: photos.length };
      saveAlbums(albums);
    }

    return newPhoto;
  };

  const getAlbumPhotos = (albumId) => {
    const photosKey = `fb_album_photos_${albumId}`;
    return JSON.parse(localStorage.getItem(photosKey) || "[]");
  };

  const removePhotoFromAlbum = (albumId, photoId) => {
    const photosKey = `fb_album_photos_${albumId}`;
    const photos = JSON.parse(localStorage.getItem(photosKey) || "[]");
    const updated = photos.filter(p => p.id !== photoId);
    localStorage.setItem(photosKey, JSON.stringify(updated));

    // Update album count
    const albums = getAlbums();
    const idx = albums.findIndex(a => a.id === albumId);
    if (idx !== -1) {
      albums[idx] = { ...albums[idx], photo_count: updated.length };
      saveAlbums(albums);
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  // ── Group Management ──────────────────────────────────────────────
  const getGroups = () => {
    try { return JSON.parse(localStorage.getItem("fb_groups") || "[]"); } catch { return []; }
  };

  const saveGroups = (groups) => {
    localStorage.setItem("fb_groups", JSON.stringify(groups));
  };

  const createGroup = (groupData) => {
    if (!currentUser) return null;
    const groups = getGroups();
    const id = Date.now().toString();
    const newGroup = {
      id,
      ...groupData,
      created_at: new Date().toISOString(),
      members_count: 1,
    };
    groups.push(newGroup);
    saveGroups(groups);

    // Add current user as member
    const membersKey = `fb_group_members_${id}`;
    localStorage.setItem(membersKey, JSON.stringify([currentUser.id]));

    return newGroup;
  };

  const getGroupsByUser = (userId) => {
    const groups = getGroups();
    return groups.filter(g => {
      const membersKey = `fb_group_members_${g.id}`;
      const members = JSON.parse(localStorage.getItem(membersKey) || "[]");
      return members.includes(userId);
    });
  };

  const getGroupById = (groupId) => {
    const groups = getGroups();
    return groups.find(g => g.id === groupId) || null;
  };

  const getGroupMembers = (groupId) => {
    const membersKey = `fb_group_members_${groupId}`;
    const memberIds = JSON.parse(localStorage.getItem(membersKey) || "[]");
    return memberIds.map(id => getUserById(id)).filter(Boolean);
  };

  const addGroupMember = (groupId, userId) => {
    const membersKey = `fb_group_members_${groupId}`;
    const members = JSON.parse(localStorage.getItem(membersKey) || "[]");
    if (!members.includes(userId)) {
      members.push(userId);
      localStorage.setItem(membersKey, JSON.stringify(members));

      // Update group member count
      const groups = getGroups();
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx] = { ...groups[idx], members_count: members.length };
        saveGroups(groups);
      }
      return true;
    }
    return false;
  };

  const removeGroupMember = (groupId, userId) => {
    const membersKey = `fb_group_members_${groupId}`;
    const members = JSON.parse(localStorage.getItem(membersKey) || "[]");
    const updated = members.filter(id => id !== userId);
    localStorage.setItem(membersKey, JSON.stringify(updated));

    // Update group member count
    const groups = getGroups();
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx !== -1) {
      groups[idx] = { ...groups[idx], members_count: updated.length };
      saveGroups(groups);
    }
  };

  const postToGroup = (groupId, postData) => {
    const postsKey = `fb_group_posts_${groupId}`;
    const posts = JSON.parse(localStorage.getItem(postsKey) || "[]");
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      created_at: Date.now(),
    };
    posts.unshift(newPost);
    localStorage.setItem(postsKey, JSON.stringify(posts));
    return newPost;
  };

  const getGroupPosts = (groupId) => {
    const postsKey = `fb_group_posts_${groupId}`;
    return JSON.parse(localStorage.getItem(postsKey) || "[]");
  };
  // ─────────────────────────────────────────────────────────────────────

  const searchUsers = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const accountMatches = getAccounts().filter(a => {
      const fullName = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      const email = (a.emailAddress || "").toLowerCase();
      const username = (a.username || "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || username.includes(q);
    });
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
      sendFriendRequest, acceptFriendRequest, declineFriendRequest,
      getFriendRequests, getFriends, isFriend, hasPendingRequest,
      createAlbum, getAlbumById, getUserAlbums, addPhotoToAlbum,
      getAlbumPhotos, removePhotoFromAlbum,
      createGroup, getGroupsByUser, getGroupById, getGroupMembers,
      addGroupMember, removeGroupMember, postToGroup, getGroupPosts,
      createMarketplaceListing, getMarketplaceListings, getMarketplaceListingById,
      updateMarketplaceListing, createDirectMessage,
    }}>
      {children}
    </FBAuthContext.Provider>
  );
}

export function useFBAuth() {
  return useContext(FBAuthContext);
}