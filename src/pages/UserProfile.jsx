import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, UserPlus, MessageCircle, ChevronDown } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { FEED_POSTS } from "@/data/feedPosts";

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { getUserById, currentUser } = useFBAuth();
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

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

  // Use posts from this "user" — show a couple from feed matching vibe or generic
  const userPosts = FEED_POSTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Top nav */}
      <div className="flex items-center justify-between px-3 py-2 sticky top-0 z-40 bg-[#F0F2F5]">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white">
        {/* Cover */}
        <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-400" />

        <div className="px-4 pb-4">
          {/* Avatar + name row */}
          <div className="flex items-end justify-between -mt-12 mb-2">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-300 shadow">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{user.firstName?.[0]}</span>
                </div>
              )}
            </div>
            <button className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
              <ChevronDown className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Name & stats */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
            {user.is_verified && (
              <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {user.followers || 0} followers · {user.following || 0} following · {user.likes || 0} likes
          </p>

          {/* Action buttons */}
          {!isOwnProfile ? (
            <div className="flex gap-2">
              <button
                onClick={() => setFollowing(!following)}
                className={`flex-1 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-colors ${
                  following ? "bg-gray-100 text-gray-800" : "bg-[#1877F2] text-white"
                }`}
              >
                {following ? (
                  <><span>✓</span> Following</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Follow</>
                )}
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                <MessageCircle className="w-4 h-4" /> Message
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg text-sm"
            >
              View your profile
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200 px-2">
          {["All", "Photos", "Reels", "Mentions"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "text-[#1877F2] border-b-2 border-[#1877F2]"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-base text-gray-900 mb-3">Details</h2>
        {birthday && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🎂</span>
            <span className="text-gray-700 text-sm">{format(birthday, "MMMM d, yyyy")}</span>
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">📅</span>
          <span className="text-gray-700 text-sm">Joined {new Date(user.created_date || Date.now()).getFullYear()}</span>
        </div>
        {user.gender && (
          <div className="flex items-center gap-3">
            <span className="text-xl">👤</span>
            <span className="text-gray-700 text-sm capitalize">{user.gender}</span>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="bg-white mt-2 px-4 py-3">
        <h2 className="font-bold text-base text-gray-900 mb-3">All posts</h2>
      </div>

      {userPosts.map(post => (
        <div key={post.id} className="bg-white mb-2 shadow-sm">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white font-bold">{user.firstName?.[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 text-sm">{fullName}</span>
                  {user.is_verified && (
                    <div className="w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{post.time} · {post.privacy}</p>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
          <p className="px-4 pb-2 text-sm text-gray-900">{post.content}</p>
          {post.image && <img src={post.image} alt="post" className="w-full object-cover" style={{maxHeight: 320}} />}
          <div className="flex px-1 py-1 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold">👍 Like</button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold">💬 Comment</button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-semibold">↗️ Share</button>
          </div>
        </div>
      ))}
    </div>
  );
}