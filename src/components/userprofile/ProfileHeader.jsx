import { useNavigate } from "react-router-dom";
import { Check, UserPlus, MessageCircle } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function ProfileHeader({ user, theme, fullName, friendStatus, onAddFriend, isOwnProfile }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-t-3xl -mt-6 px-4 pt-4 pb-0 shadow-sm">
      <div className="flex items-start gap-4 mb-3">
        {/* Avatar */}
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
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{fullName}</h1>
            {user.is_verified && <VerifiedBadge size={20} />}
          </div>
          {user.username && (
            <p className="text-xs text-[#1877F2] font-medium">@{user.username}</p>
          )}
          <p className="text-sm text-gray-800 mt-1">
            <span className="font-bold">{formatCount(user.followers)}</span>
            <span className="text-gray-500"> followers · </span>
            <span className="font-bold">{formatCount(user.following)}</span>
            <span className="text-gray-500"> following</span>
          </p>
        </div>
      </div>

      {/* Bio */}
      {(user.bio || theme.bio) && (
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-line leading-relaxed">
          {user.bio || theme.bio}
        </p>
      )}

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
          🎬 {user.category || theme.category}
        </span>
        {(user.location || user.currentCity) && (
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
            📍 {user.location || user.currentCity}
          </span>
        )}
        {user.relationshipStatus && (
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
            💕 {user.relationshipStatus}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {!isOwnProfile ? (
        <div className="flex gap-2 mb-4">
          <button
            onClick={onAddFriend}
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
            onClick={() => navigate("/messages", { state: { startChatWith: user } })}
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
        {["Posts", "Photos", "Friends", "About"].map(tab => (
          <button
            key={tab}
            className="tab-btn"
            data-tab={tab}
          />
        ))}
      </div>
    </div>
  );
}