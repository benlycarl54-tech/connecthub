import { createContext, useContext, useState, useEffect } from "react";
import { FEED_USERS, getFeedUserById } from "@/data/feedUsers.js";
import { base44 } from "@/api/base44Client";

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

  const register = async (profileData) => {
    try {
      const baseUsername = `${(profileData.firstName || "").toLowerCase()}${(profileData.lastName || "").toLowerCase()}`.replace(/\s+/g, "");
      const allUsers = await base44.entities.User.list();
      const suffix = Date.now().toString().slice(-4);
      const autoUsername = profileData.username || (baseUsername ? `${baseUsername}${suffix}` : `user${suffix}`);
      
      const newUser = await base44.entities.User.create({
        ...profileData,
        username: autoUsername,
        followers: 0,
        following: 0,
        likes: 0,
        is_verified: false,
        is_admin: allUsers.length === 0, // First user becomes admin
        is_banned: false,
      });
      
      localStorage.setItem("fbCurrentUser", JSON.stringify(newUser));
      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (identifier, password) => {
    try {
      const users = await base44.entities.User.filter({});
      const user = users.find(u =>
        (u.emailAddress === identifier || u.mobileNumber === identifier)
      );
      
      if (!user) {
        return { success: false, error: "No account found with this email or mobile number. Please create an account." };
      }
      
      if (user.password !== password) {
        return { success: false, error: "Incorrect password. Please try again." };
      }
      
      if (user.is_banned) {
        return { success: false, error: "This account has been suspended. Please contact support." };
      }
      
      localStorage.setItem("fbCurrentUser", JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("fbCurrentUser");
    setCurrentUser(null);
  };

  const updateCurrentUser = async (updates) => {
    try {
      if (!currentUser?.id) return;
      const updated = await base44.entities.User.update(currentUser.id, updates);
      localStorage.setItem("fbCurrentUser", JSON.stringify(updated));
      setCurrentUser(updated);
    } catch (error) {
      console.error("Update user error:", error);
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

  // Friend request management — DB-backed
  const sendFriendRequest = async (targetUserId) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    // Check if already sent
    const existing = await base44.entities.FriendRequest.filter({ from_user_id: currentUser.id, to_user_id: targetUserId, status: "pending" });
    if (existing.length > 0) return;
    await base44.entities.FriendRequest.create({
      from_user_id: currentUser.id,
      from_first_name: currentUser.firstName,
      from_last_name: currentUser.lastName,
      from_avatar: currentUser.profilePicture || null,
      to_user_id: targetUserId,
      status: "pending",
    });
    pushNotification(targetUserId, {
      type: "friend_request",
      text: `${currentUser.firstName} ${currentUser.lastName} sent you a friend request.`,
      avatar: currentUser.profilePicture || null,
      avatarInitial: currentUser.firstName?.[0] || "?",
      avatarColor: "bg-[#1877F2]",
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
  };

  const acceptFriendRequest = async (requestId) => {
    if (!currentUser) return;
    await base44.entities.FriendRequest.update(requestId, { status: "accepted" });
    // Create friendship record (sorted IDs to avoid duplicates)
    const req = await base44.entities.FriendRequest.get(requestId);
    const [u1, u2] = [req.from_user_id, currentUser.id].sort();
    const existing = await base44.entities.Friendship.filter({ user1_id: u1, user2_id: u2 });
    if (existing.length === 0) {
      await base44.entities.Friendship.create({ user1_id: u1, user2_id: u2 });
    }
  };

  const declineFriendRequest = async (requestId) => {
    if (!currentUser) return;
    await base44.entities.FriendRequest.update(requestId, { status: "declined" });
  };

  const getFriendRequests = async () => {
    if (!currentUser) return [];
    return await base44.entities.FriendRequest.filter({ to_user_id: currentUser.id, status: "pending" });
  };

  const getFriends = async () => {
    if (!currentUser) return [];
    const [f1, f2] = await Promise.all([
      base44.entities.Friendship.filter({ user1_id: currentUser.id }),
      base44.entities.Friendship.filter({ user2_id: currentUser.id }),
    ]);
    const allFriendships = [...f1, ...f2];
    const friendIds = allFriendships.map(f => f.user1_id === currentUser.id ? f.user2_id : f.user1_id);
    const users = await Promise.all(friendIds.map(id => base44.entities.User.get(id).catch(() => null)));
    return users.filter(Boolean);
  };

  const isFriend = async (userId) => {
    if (!currentUser) return false;
    const [u1, u2] = [currentUser.id, userId].sort();
    const existing = await base44.entities.Friendship.filter({ user1_id: u1, user2_id: u2 });
    return existing.length > 0;
  };

  const hasPendingRequest = async (userId) => {
    if (!currentUser) return false;
    const existing = await base44.entities.FriendRequest.filter({ from_user_id: currentUser.id, to_user_id: userId, status: "pending" });
    return existing.length > 0;
  };

  const getPendingRequestCount = async () => {
    if (!currentUser) return 0;
    const reqs = await base44.entities.FriendRequest.filter({ to_user_id: currentUser.id, status: "pending" });
    return reqs.length;
  };

  const getAllUsers = async () => {
    try {
      const users = await base44.entities.User.list();
      return [...users, ...FEED_USERS];
    } catch (error) {
      console.error("Get all users error:", error);
      return FEED_USERS;
    }
  };

  const getUserById = async (id) => {
    try {
      if (id && id.startsWith("feed_")) return getFeedUserById(id);
      return await base44.entities.User.get(id);
    } catch (error) {
      return null;
    }
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

  const searchUsers = async (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    try {
      const users = await base44.entities.User.list();
      const accountMatches = users.filter(a => {
        const fullName = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        const email = (a.emailAddress || "").toLowerCase();
        const username = (a.username || "").toLowerCase();
        return fullName.includes(q) || email.includes(q) || username.includes(q);
      });
      const feedMatches = FEED_USERS.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      );
      return [...accountMatches, ...feedMatches];
    } catch (error) {
      return FEED_USERS.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      );
    }
  };

  const adminUpdateUser = async (userId, updates) => {
    try {
      const updated = await base44.entities.User.update(userId, updates);
      if (currentUser?.id === userId) {
        localStorage.setItem("fbCurrentUser", JSON.stringify(updated));
        setCurrentUser(updated);
      }
    } catch (error) {
      console.error("Admin update error:", error);
    }
  };

  return (
    <FBAuthContext.Provider value={{
      currentUser, register, login, logout,
      updateCurrentUser, getAllUsers, getUserById, searchUsers,
      adminUpdateUser, followUser, isFollowing,
      sendFriendRequest, acceptFriendRequest, declineFriendRequest,
      getFriendRequests, getFriends, isFriend, hasPendingRequest, getPendingRequestCount,
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