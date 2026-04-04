import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, UserPlus, MessageCircle, Link2, MapPin, Star, Clock, Mail, Check } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useFBAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { FEED_POSTS } from "@/data/feedPosts";
import PostCard from "@/components/post/PostCard";

// Each user gets a distinct profile style/theme
const PROFILE_THEMES = [
  { cover: "from-blue-400 to-blue-700", ring: "ring-blue-400", badge: "Rising creator", badgeIcon: "🌅", badgeColor: "bg-orange-400", badge2: "Fan favorite", badge2Icon: "⭐", badge2Color: "bg-orange-300", category: "Digital creator", bio: "IT'S MY OFFICIAL PAGE GUYS\nI LOVE ❤️❤️ YOU GUYS ❤️❤️" },
  { cover: "from-teal-400 to-emerald-600", ring: "ring-teal-400", badge: "Gaming creator", badgeIcon: "🎮", badgeColor: "bg-green-500", badge2: "Top fan", badge2Icon: "🏆", badge2Color: "bg-yellow-400", category: "Gaming video creator", bio: "👉 Learn how I make viral content\nAlways creating something new! 🚀" },
  { cover: "from-purple-500 to-pink-600", ring: "ring-purple-400", badge: "Comedian", badgeIcon: "😂", badgeColor: "bg-pink-500", badge2: "Community fav", badge2Icon: "💫", badge2Color: "bg-purple-400", category: "Comedian", bio: "Welcome to my page 💎\nI'm with you spiritually 💎" },
  { cover: "from-green-500 to-teal-700", ring: "ring-green-400", badge: "Content creator", badgeIcon: "✏️", badgeColor: "bg-teal-500", badge2: "Top rated", badge2Icon: "🌟", badge2Color: "bg-green-400", category: "Content creator", bio: "Content creator\nGraphics designer... See more" },
  { cover: "from-red-500 to-orange-600", ring: "ring-red-400", badge: "Verified creator", badgeIcon: "🔥", badgeColor: "bg-red-500", badge2: "Top comedian", badge2Icon: "😄", badge2Color: "bg-orange-400", category: "Comedian", bio: "Dedicated to bringing you fresh content daily.\nStay tuned! 📱" },
];

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { getUserById, currentUser, followUser, isFollowing } = useFBAuth();
  const [localFollowing, setLocalFollowing] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const following = localFollowing !== null ? localFollowing : isFollowing(userId);

  const handleFollow = () => {
    const nowFollowing = followUser(userId);
    setLocalFollowing(nowFollowing);
  };

  const user = getUserById(userId);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="text-5xl mb-4">👤</div>
        <p className="font-semibold text-gray-900">User not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#1877F2] font-semibold">Go back</button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;
  const fullName = `${user.firstName} ${user.lastName}`;
  const birthday = user.birthday ? new Date(user.birthday) : null;

  // Pick a unique theme based on user id hash
  const idNum = user.id?.startsWith("feed_")
    ? parseInt(user.id.replace("feed_", ""), 10)
    : parseInt(user.id?.slice(-3) || "0", 10) || 0;
  const themeIdx = (idNum || 0) % PROFILE_THEMES.length;
  const theme = PROFILE_THEMES[themeIdx];

  // Use the user's own bio/category/location if available
  const displayCategory = user.category || theme.category;
  const displayBio = user.bio || theme.bio;
  const displayLocation = user.location || null;

  // Use posts from the feed that belong to this user
  const userPosts = FEED_POSTS.filter(p => p.authorId === user.id);
  const displayPosts = userPosts.length ? userPosts : FEED_POSTS.slice(themeIdx, themeIdx + 3);

  const formatCount = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Top nav — overlaid on cover */}
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
        {user.profilePicture && (
          <img src={user.profilePicture} alt="cover" className="w-full h-full object-cover opacity-50" />
        )}
      </div>

      {/* Profile card — white card overlapping cover */}
      <div className="bg-white mx-0 rounded-t-3xl -mt-6 px-4 pt-4 pb-0 shadow-sm">
        <div className="flex items-start gap-4 mb-3">
          {/* Avatar with colored ring */}
          <div className={`w-20 h-20 rounded-full border-4 border-white ring-4 ${theme.ring} overflow-hidden bg-gray-300 shadow-lg flex-shrink-0 -mt-14`}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{user.firstName?.[0]}</span>
              </div>
            )}
          </div>

          {/* Name & stats */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{fullName}</h1>
              {user.is_verified && <VerifiedBadge size={20} />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatCount(user.followers)} followers · {formatCount(user.following)} following · {formatCount(user.likes || 0)} likes
            </p>
          </div>
        </div>

        {/* Page type & bio */}
        <p className="text-xs text-gray-400 mb-1">Page · {displayCategory}</p>
        {displayBio && (
          <p className="text-sm text-gray-800 mb-3 whitespace-pre-line">{displayBio}</p>
        )}

        {/* Category badge row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1">
            🎬 {displayCategory}
          </span>
          {displayLocation && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1">
              📍 {displayLocation}
            </span>
          )}
          {user.mobileNumber && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1">
              📱 {user.mobileNumber}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!isOwnProfile ? (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleFollow}
              className={`flex-1 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                following ? "bg-gray-100 text-gray-800" : "bg-[#1877F2] text-white"
              }`}
            >
              {following ? (
                <><Check className="w-4 h-4" /> Following</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Follow</>
              )}
            </button>
            <button className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">
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
          {["All", "Photos", "Reels", "Mentions"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Badges section */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-base text-gray-900 mb-3">Badges</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme.badgeColor} rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
              {theme.badgeIcon}
            </div>
            <span className="font-semibold text-gray-800 text-sm">{theme.badge}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme.badge2Color} rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
              {theme.badge2Icon}
            </div>
            <span className="font-semibold text-gray-800 text-sm">{theme.badge2}</span>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-base text-gray-900 mb-3">Details</h2>
        {displayLocation && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-gray-700 text-sm">{displayLocation}</span>
          </div>
        )}
        {birthday && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base">🎂</span>
            </div>
            <span className="text-gray-700 text-sm">{format(birthday, "MMMM d")}</span>
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-gray-700 text-sm">100% recommend</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-gray-700 text-sm">Always open</span>
        </div>
        {user.gender && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base">👤</span>
            </div>
            <span className="text-gray-700 text-sm capitalize">{user.gender}</span>
          </div>
        )}
      </div>

      {/* Links & Contact */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-base text-gray-900 mb-3">Links</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Link2 className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-[#1877F2] text-sm">{fullName.replace(" ", "")}'s Page</span>
        </div>
        <h2 className="font-bold text-base text-gray-900 mb-3">Contact info</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-gray-700 text-sm">{user.emailAddress || `${user.firstName?.toLowerCase()}@example.com`}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-gray-700 text-sm">{fullName}</span>
        </div>
      </div>

      {/* All posts */}
      <div className="bg-white mt-2 px-4 py-3">
        <h2 className="font-bold text-base text-gray-900">All posts</h2>
      </div>

      {displayPosts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          authorName={fullName}
          authorAvatar={user.profilePicture}
          authorVerified={user.is_verified}
        />
      ))}

      <div className="h-6" />
    </div>
  );
}