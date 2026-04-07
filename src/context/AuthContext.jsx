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

  // Sync with Base44 auth on mount — find/create UserProfile record for this Base44 user
  useEffect(() => {
    (async () => {
      try {
        const b44User = await base44.auth.me();
        if (!b44User) return;
        // Try to find existing UserProfile linked to this Base44 user
        let profiles = await base44.entities.UserProfile.filter({ email_address: b44User.email });
        let profile = profiles[0];
        if (!profile) {
          // Auto-create a UserProfile for this Base44 user on first login
          const nameParts = (b44User.full_name || "").split(" ");
          profile = await base44.entities.UserProfile.create({
            first_name: nameParts[0] || b44User.email.split("@")[0],
            last_name: nameParts.slice(1).join(" ") || "",
            email_address: b44User.email,
          });
        }
        // Build a merged currentUser object compatible with all existing components
        const merged = {
          id: b44User.id,
          firstName: profile.first_name || b44User.full_name?.split(" ")[0] || b44User.email.split("@")[0],
          lastName: profile.last_name || b44User.full_name?.split(" ").slice(1).join(" ") || "",
          emailAddress: b44User.email,
          profilePicture: profile.profile_picture || null,
          is_verified: profile.is_verified || false,
          is_admin: b44User.role === "admin",
          is_banned: false,
          followers: profile.followers || 0,
          following: profile.following || 0,
          likes: profile.likes || 0,
          ...profile,
          // Normalize field names — must come after spread to override
          id: b44User.id,
          firstName: profile.first_name || b44User.full_name?.split(" ")[0] || b44User.email.split("@")[0],
          lastName: profile.last_name || b44User.full_name?.split(" ").slice(1).join(" ") || "",
          emailAddress: b44User.email,
          is_admin: b44User.role === "admin",
          followers: profile.followers || 0,
          following: profile.following || 0,
          likes: profile.likes || 0,
        };
        localStorage.setItem("fbCurrentUser", JSON.stringify(merged));
        setCurrentUser(merged);
      } catch (e) {
        // Not authenticated — clear stale data
        localStorage.removeItem("fbCurrentUser");
        setCurrentUser(null);
      }
    })();
  }, []);

  const register = async (profileData) => {
    // With Base44 auth, registration is handled by the platform.
    // This just creates/updates the UserProfile record.
    try {
      const b44User = await base44.auth.me();
      const existing = b44User ? await base44.entities.UserProfile.filter({ email_address: b44User.email }) : [];
      let profile;
      if (existing[0]) {
        profile = await base44.entities.UserProfile.update(existing[0].id, {
          first_name: profileData.firstName || existing[0].first_name,
          last_name: profileData.lastName || existing[0].last_name,
          profile_picture: profileData.profilePicture || existing[0].profile_picture,
          mobile_number: profileData.mobileNumber || existing[0].mobile_number,
          birthday: profileData.birthday || existing[0].birthday,
          gender: profileData.gender || existing[0].gender,
        });
      } else {
        profile = await base44.entities.UserProfile.create({
          first_name: profileData.firstName || "",
          last_name: profileData.lastName || "",
          email_address: b44User?.email || profileData.emailAddress || "",
          profile_picture: profileData.profilePicture || null,
          mobile_number: profileData.mobileNumber || "",
          birthday: profileData.birthday || "",
          gender: profileData.gender || "",
        });
      }
      const merged = {
        ...profile,
        id: b44User?.id || profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        emailAddress: profile.email_address || "",
        profilePicture: profile.profile_picture || null,
        is_verified: profile.is_verified || false,
        is_admin: b44User?.role === "admin",
        is_banned: false,
      };
      localStorage.setItem("fbCurrentUser", JSON.stringify(merged));
      setCurrentUser(merged);
      return merged;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (identifier, password) => {
    // Legacy login kept for AdminPanel "login as user" compatibility
    try {
      const users = await base44.entities.UserProfile.filter({ email_address: identifier });
      const user = users[0];
      if (!user) {
        return { success: false, error: "No account found with this email or mobile number." };
      }
      // Build merged user object
      const merged = {
        id: user.created_by || user.id,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        emailAddress: user.email_address,
        mobileNumber: user.mobile_number || "",
        profilePicture: user.profile_picture || null,
        is_verified: user.is_verified || false,
        is_admin: false,
        is_banned: false,
        followers: 0,
        following: 0,
        likes: 0,
        ...user,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        emailAddress: user.email_address,
      };
      localStorage.setItem("fbCurrentUser", JSON.stringify(merged));
      setCurrentUser(merged);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("fbCurrentUser");
    setCurrentUser(null);
    base44.auth.logout(window.location.origin + "/");
  };

  const updateCurrentUser = async (updates) => {
    try {
      if (!currentUser?.id) return;
      // Map FB-style fields to UserProfile fields
      const profileUpdates = {};
      if (updates.firstName !== undefined) profileUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) profileUpdates.last_name = updates.lastName;
      if (updates.profilePicture !== undefined) profileUpdates.profile_picture = updates.profilePicture;
      if (updates.coverPhoto !== undefined) profileUpdates.cover_photo = updates.coverPhoto;
      if (updates.is_verified !== undefined) profileUpdates.is_verified = updates.is_verified;
      if (updates.followers !== undefined) profileUpdates.followers = updates.followers;
      if (updates.following !== undefined) profileUpdates.following = updates.following;
      if (updates.likes !== undefined) profileUpdates.likes = updates.likes;
      // Find and update the UserProfile
      const profiles = await base44.entities.UserProfile.filter({ email_address: currentUser.emailAddress });
      if (profiles[0]) {
        await base44.entities.UserProfile.update(profiles[0].id, profileUpdates);
      }
      const merged = { ...currentUser, ...updates };
      localStorage.setItem("fbCurrentUser", JSON.stringify(merged));
      setCurrentUser(merged);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  // Follow / unfollow a user and push a notification to them
  const followUser = async (targetUserId) => {
    if (!currentUser) return;
    const followKey = `fb_following_${currentUser.id}`;
    const following = JSON.parse(localStorage.getItem(followKey) || "[]");
    const alreadyFollowing = following.includes(targetUserId);

    if (alreadyFollowing) {
      // Unfollow
      const updated = following.filter(id => id !== targetUserId);
      localStorage.setItem(followKey, JSON.stringify(updated));
      updateCurrentUser({ following: Math.max(0, (currentUser.following || 0) - 1) });
      // Decrement target's followers in DB
      const targetProfiles = await base44.entities.UserProfile.filter({ created_by: targetUserId });
      if (targetProfiles[0]) {
        await base44.entities.UserProfile.update(targetProfiles[0].id, {
          followers: Math.max(0, (targetProfiles[0].followers || 0) - 1),
        });
      }
    } else {
      // Follow
      following.push(targetUserId);
      localStorage.setItem(followKey, JSON.stringify(following));
      updateCurrentUser({ following: (currentUser.following || 0) + 1 });
      // Increment target's followers in DB
      const targetProfiles = await base44.entities.UserProfile.filter({ created_by: targetUserId });
      if (targetProfiles[0]) {
        await base44.entities.UserProfile.update(targetProfiles[0].id, {
          followers: (targetProfiles[0].followers || 0) + 1,
        });
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
    const users = await Promise.all(friendIds.map(id => getUserById(id)));
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
      const profiles = await base44.entities.UserProfile.list();
      // Normalize to FB-style user objects, deduplicate by id
      const seen = new Set();
      const normalized = profiles
        .map(p => ({
          ...p,
          id: p.created_by || p.id,
          firstName: p.first_name || "",
          lastName: p.last_name || "",
          emailAddress: p.email_address || "",
          mobileNumber: p.mobile_number || "",
          profilePicture: p.profile_picture || null,
          is_verified: p.is_verified || false,
          is_admin: false,
          is_banned: false,
          followers: p.followers || 0,
          following: p.following || 0,
          likes: p.likes || 0,
        }))
        .filter(p => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      return normalized;
    } catch (error) {
      console.error("Get all users error:", error);
      return [];
    }
  };

  const getUserById = async (id) => {
    try {
      if (id && id.startsWith("feed_")) return getFeedUserById(id);
      const profiles = await base44.entities.UserProfile.filter({ created_by: id });
      if (profiles[0]) {
        const p = profiles[0];
        return {
          ...p,
          id: p.created_by || p.id,
          firstName: p.first_name || "",
          lastName: p.last_name || "",
          emailAddress: p.email_address || "",
          profilePicture: p.profile_picture || null,
          coverPhoto: p.cover_photo || null,
          is_verified: p.is_verified || false,
          is_admin: false,
          is_banned: false,
          followers: p.followers || 0,
          following: p.following || 0,
          likes: p.likes || 0,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // ── Marketplace Management ──────────────────────────────────────────────
  const getMarketplaceListings = async () => {
    try {
      return await base44.entities.Marketplace.list();
    } catch {
      return [];
    }
  };

  const createMarketplaceListing = async (listingData) => {
    if (!currentUser) return null;
    try {
      return await base44.entities.Marketplace.create({
        ...listingData,
        seller_id: currentUser.id,
      });
    } catch (error) {
      console.error("Create marketplace listing error:", error);
      return null;
    }
  };

  const getMarketplaceListingById = async (listingId) => {
    try {
      const listings = await base44.entities.Marketplace.filter({ id: listingId });
      return listings[0] || null;
    } catch {
      return null;
    }
  };

  const updateMarketplaceListing = async (listingId, updates) => {
    try {
      await base44.entities.Marketplace.update(listingId, updates);
      return await getMarketplaceListingById(listingId);
    } catch (error) {
      console.error("Update marketplace listing error:", error);
      return null;
    }
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

  const createPost = async (postData) => {
    if (!currentUser) return null;
    try {
      return await base44.entities.Post.create({
        author_id: currentUser.id,
        author_name: `${currentUser.firstName} ${currentUser.lastName}`,
        author_avatar: currentUser.profilePicture || null,
        content: postData.content || "",
        image_url: postData.image_url || null,
      });
    } catch (error) {
      console.error("Create post error:", error);
      return null;
    }
  };

  const getAllPosts = async () => {
    try {
      return await base44.entities.Post.list();
    } catch {
      return [];
    }
  };

  const getUserPosts = async (userId) => {
    try {
      return await base44.entities.Post.filter({ author_id: userId });
    } catch {
      return [];
    }
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
      const profiles = await base44.entities.UserProfile.list();
      const seen = new Set();
      return profiles
        .filter(p => {
          const fullName = `${p.first_name || ""} ${p.last_name || ""}`.toLowerCase();
          const email = (p.email_address || "").toLowerCase();
          return fullName.includes(q) || email.includes(q);
        })
        .map(p => ({
          ...p,
          id: p.created_by || p.id,
          firstName: p.first_name || "",
          lastName: p.last_name || "",
          emailAddress: p.email_address || "",
          profilePicture: p.profile_picture || null,
          is_verified: p.is_verified || false,
          is_admin: false,
          is_banned: false,
          followers: p.followers || 0,
          following: p.following || 0,
          likes: p.likes || 0,
        }))
        .filter(p => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
    } catch (error) {
      return [];
    }
  };

  const adminUpdateUser = async (userId, updates) => {
    try {
      const profileUpdates = {};
      if (updates.firstName !== undefined) profileUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) profileUpdates.last_name = updates.lastName;
      if (updates.emailAddress !== undefined) profileUpdates.email_address = updates.emailAddress;
      if (updates.mobileNumber !== undefined) profileUpdates.mobile_number = updates.mobileNumber;
      if (updates.profilePicture !== undefined) profileUpdates.profile_picture = updates.profilePicture;
      if (updates.is_verified !== undefined) profileUpdates.is_verified = updates.is_verified;
      // Update Base44 User role when is_admin changes
      if (updates.is_admin !== undefined) {
        await base44.entities.User.update(userId, { role: updates.is_admin ? "admin" : "user" });
      }
      const profiles = await base44.entities.UserProfile.filter({ created_by: userId });
      if (profiles[0]) {
        await base44.entities.UserProfile.update(profiles[0].id, profileUpdates);
      }
      if (currentUser?.id === userId) {
        const merged = { ...currentUser, ...updates };
        localStorage.setItem("fbCurrentUser", JSON.stringify(merged));
        setCurrentUser(merged);
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
      createPost, getAllPosts, getUserPosts,
    }}>
      {children}
    </FBAuthContext.Provider>
  );
}

export function useFBAuth() {
  return useContext(FBAuthContext);
}