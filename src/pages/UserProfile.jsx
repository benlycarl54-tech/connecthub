import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, Check, UserPlus, MessageCircle } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useFBAuth } from "@/context/AuthContext";
import { FEED_POSTS } from "@/data/feedPosts";
import PostsGrid from "@/components/userprofile/PostsGrid";
import FriendsList from "@/components/userprofile/FriendsList";
import AboutSection from "@/components/userprofile/AboutSection";

const PROFILE_THEMES = [
  { cover: "from-blue-400 to-blue-700", ring: "ring-blue-400", badge: "Rising creator", badgeIcon: "🌅", badgeColor: "bg-orange-400", badge2: "Fan favorite", badge2Icon: "⭐", badge2Color: "bg-orange-300", category: "Digital creator", bio: "IT'S MY OFFICIAL PAGE GUYS\nI LOVE ❤️❤️ YOU GUYS ❤️❤️" },
  { cover: "from-teal-400 to-emerald-600", ring: "ring-teal-400", badge: "Gaming creator", badgeIcon: "🎮", badgeColor: "bg-green-500", badge2: "Top fan", badge2Icon: "🏆", badge2Color: "bg-yellow-400", category: "Gaming video creator", bio: "👉 Learn how I make viral content\nAlways creating something new! 🚀" },
  { cover: "from-purple-500 to-pink-600", ring: "ring-purple-400", badge: "Comedian", badgeIcon: "😂", badgeColor: "bg-pink-500", badge2: "Community fav", badge2Icon: "💫", badge2Color: "bg-purple-400", category: "Comedian", bio: "Welcome to my page 💎\nI'm with you spiritually 💎" },
  { cover: "from-green-500 to-teal-700", ring: "ring-green-400", badge: "Content creator", badgeIcon: "✏️", badgeColor: "bg-teal-500", badge2: "Top rated", badge2Icon: "🌟", badge2Color: "bg-green-400", category: "Content creator", bio: "Content creator\nGraphics designer... See more" },
  { cover: "from-red-500 to-orange-600", ring: "ring-red-400", badge: "Verified creator", badgeIcon: "🔥", badgeColor: "bg-red-500", badge2: "Top comedian", badge2Icon: "😄", badge2Color: "bg-orange-400", category: "Comedian", bio: "Dedicated to bringing you fresh content daily.\nStay tuned! 📱" },
];

const TABS = ["Posts", "Photos", "Friends", "About"];

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { getUserById, currentUser, followUser, isFollowing, sendFriendRequest, isFriend, hasPendingRequest } = useFBAuth();
  const [activeTab, setActiveTab] = useState("Posts");
  const [actualUser, setActualUser] = useState(null);
  const [friendStatus, setFriendStatus] = useState("none");
  const [localFollowing, setLocalFollowing] = useState(null);

  useEffect(() => {
    async function load() {
      const u = await getUserById(userId);
      setActualUser(u);
      if (u && currentUser && u.id !== currentUser.id) {
        const [friend, pending] = await Promise.all([isFriend(userId), hasPendingRequest(userId)]);
        setFriendStatus(friend ? "friend" : pending ? "pending" : "none");
      }
    }
    load();
  }, [userId, currentUser]);

  if (!actualUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1877F2] rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === actualUser.id;
  const fullName = `${actualUser.firstName} ${actualUser.lastName}`;
  const following = localFollowing !== null ? localFollowing : isFollowing(userId);

  const idNum = actualUser.id?.startsWith("feed_")
    ? parseInt(actualUser.id.replace("feed_", ""), 10)
    : parseInt(actualUser.id?.slice(-3) || "0", 10) || 0;
  const theme = PROFILE_THEMES[(idNum || 0) % PROFILE_THEMES.length];

  // Posts: real user posts from localStorage, then fallback to feed posts
  const localPosts = (() => {
    try { return JSON.parse(localStorage.getItem("fb_user_posts") || "[]").filter(p => p.authorId === actualUser.id); } catch { return []; }
  })();
  const feedPosts = FEED_POSTS.filter(p => p.authorId === actualUser.id);
  const allPosts = [...localPosts, ...feedPosts];
  const displayPosts = allPosts.length ? allPosts : FEED_POSTS.slice((idNum || 0) % PROFILE_THEMES.length, ((idNum || 0) % PROFILE_THEMES.length) + 3);

  // Photos only (posts with images)
  const photoPosts = displayPosts.filter(p => p.image || p.videoThumb);

  const handleAddFriend = async () => {
    if (friendStatus !== "none") return;
    setFriendStatus("pending");
    await sendFriendRequest(userId);
  };

  const handleFollow = () => {
    const nowFollowing = followUser(userId);
    setLocalFollowing(nowFollowing);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-8">
      {/* Top nav overlaid on cover */}
      <div className="flex items-center justify-between px-3 py-2 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/search")} className="w-9 h-9 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Search className="w-5 h-5 text-white" />
          </button>
          <button className="w-9 h-9 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Cover photo */}
      <div className={`w-full h-52 bg-gradient-to-br ${theme.cover} -mt-14`}>
        {actualUser.coverPhoto && (
          <img src={actualUser.coverPhoto} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-t-3xl -mt-6 px-4 pt-4 pb-0 shadow-sm">
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-full border-4 border-white ring-4 ${theme.ring} overflow-hidden bg-gray-300 shadow-lg flex-shrink-0 -mt-14`}>
            {actualUser.profilePicture ? (
              <img src={actualUser.profilePicture} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{actualUser.firstName?.[0]}</span>
              </div>
            )}
          </div>
          {/* Name & stats */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{fullName}</h1>
              {actualUser.is_verified && <VerifiedBadge size={20} />}
            </div>
            {actualUser.username && (
              <p className="text-xs text-[#1877F2] font-medium">@{actualUser.username}</p>
            )}
            <p className="text-sm text-gray-800 mt-1">
              <span className="font-bold">{actualUser.followers || 0}</span>
              <span className="text-gray-500"> followers · </span>
              <span className="font-bold">{actualUser.following || 0}</span>
              <span className="text-gray-500"> following</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        {(actualUser.bio || theme.bio) && (
          <p className="text-sm text-gray-800 mb-3 whitespace-pre-line leading-relaxed">
            {actualUser.bio || theme.bio}
          </p>
        )}

        {/* Category chips */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
            🎬 {actualUser.category || theme.category}
          </span>
          {(actualUser.location || actualUser.currentCity) && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
              📍 {actualUser.location || actualUser.currentCity}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!isOwnProfile ? (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleAddFriend}
              disabled={friendStatus !== "none"}
              className={`flex-1 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                friendStatus === "friend" ? "bg-green-100 text-green-700" :
                friendStatus === "pending" ? "bg-gray-100 text-gray-500" :
                "bg-[#1877F2] text-white"
              }`}
            >
              {friendStatus === "friend" ? <><Check className="w-4 h-4" /> Friends</> :
               friendStatus === "pending" ? <><Check className="w-4 h-4" /> Requested</> :
               <><UserPlus className="w-4 h-4" /> Add friend</>}
            </button>
            <button
              onClick={() => navigate("/messages", { state: { startChatWith: actualUser } })}
              className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Message
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="w-full mb-4 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-lg text-sm"
          >
            View your profile
          </button>
        )}

        {/* Tabs */}
        <div className="flex border-t border-gray-100 -mx-4 px-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Posts" && (
        <PostsGrid posts={displayPosts} user={actualUser} fullName={fullName} />
      )}

      {activeTab === "Photos" && (
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-base text-gray-900">Photos ({photoPosts.length})</h2>
          </div>
          {photoPosts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-4xl mb-2">🖼️</p>
              <p className="text-gray-400 text-sm">No photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5">
              {photoPosts.map(post => (
                <div key={post.id} className="aspect-square overflow-hidden bg-gray-100">
                  <img src={post.image || post.videoThumb} alt="photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Friends" && (
        <FriendsList userId={actualUser.id} />
      )}

      {activeTab === "About" && (
        <AboutSection user={actualUser} theme={theme} />
      )}
    </div>
  );
}