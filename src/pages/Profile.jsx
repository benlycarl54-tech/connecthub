import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, Camera, Pencil, Plus, ChevronDown, X } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const [activeTab, setActiveTab] = useState("All");
  const [showBanner, setShowBanner] = useState(true);

  const fullName = `${data.firstName || "Your"} ${data.lastName || "Name"}`;
  const picture = data.profilePicture;
  const birthday = data.birthday ? new Date(data.birthday) : null;
  const joinedYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Top nav */}
      <div className="bg-[#F0F2F5] flex items-center justify-between px-3 py-2 sticky top-0 z-40">
        <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center">
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

      {/* Cover + Avatar area */}
      <div className="bg-white">
        <div className="relative">
          {/* Cover photo area */}
          <div className="w-full h-36 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
            <span className="text-gray-400 text-sm">Thinking about...</span>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Avatar */}
          <div className="px-4 pb-3">
            <div className="flex items-end justify-between -mt-12 mb-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow">
                  {picture ? (
                    <img src={picture} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">{(data.firstName || "U")[0]}</span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-1 right-1 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                  <Camera className="w-3.5 h-3.5 text-gray-700" />
                </button>
              </div>
              <button className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-sm text-gray-500">2 posts</p>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-[#1877F2] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Create
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                <Pencil className="w-4 h-4" /> Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Update profile banner */}
        {showBanner && (
          <div className="mx-4 mb-3 bg-blue-50 rounded-xl p-3 flex items-start gap-3 relative border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Get more out of Facebook</p>
              <p className="text-xs text-gray-500 mt-0.5">We've made it easier to add the stuff you're into, and see which friends like it too.</p>
              <button className="text-[#1877F2] font-semibold text-sm mt-2">Update your profile</button>
            </div>
            <button onClick={() => setShowBanner(false)} className="absolute top-2 right-2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-t border-gray-200 px-2">
          {["All", "Photos", "Reels"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
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

      {/* Profile details */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-gray-900">Personal details</h2>
          <button><Pencil className="w-4 h-4 text-gray-500" /></button>
        </div>

        {birthday && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🎂</span>
            <span className="text-gray-800 text-sm">{format(birthday, "MMMM d, yyyy")}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">📅</span>
          <span className="text-gray-800 text-sm">Joined Facebook in {joinedYear}</span>
        </div>

        {data.emailAddress && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">✉️</span>
            <span className="text-gray-800 text-sm">{data.emailAddress}</span>
          </div>
        )}

        {data.mobileNumber && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">📱</span>
            <span className="text-gray-800 text-sm">{data.mobileNumber}</span>
          </div>
        )}

        {data.gender && (
          <div className="flex items-center gap-3">
            <span className="text-xl">👤</span>
            <span className="text-gray-800 text-sm capitalize">{data.gender}</span>
          </div>
        )}
      </div>

      {/* Friends section */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-900">Friends</h2>
          <span className="text-[#1877F2] font-semibold text-sm">See all</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">No friends yet. Start adding people you know!</p>
      </div>

      {/* All posts section */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-gray-900">All posts</h2>
          <span className="text-[#1877F2] font-semibold text-sm">Filters</span>
        </div>

        {/* Create post bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            {picture ? (
              <img src={picture} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-sm font-bold">{(data.firstName || "U")[0]}</span>
              </div>
            )}
          </div>
          <button className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-left text-gray-400 text-sm border border-gray-200">
            What's on your mind?
          </button>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">
            🎬 Reel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">
            📹 Live
          </button>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2 text-gray-500">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold">Manage posts</span>
        </div>
      </div>

      {/* Profile picture post */}
      {picture && (
        <div className="bg-white mt-2">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                <img src={picture} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {fullName} <span className="font-normal text-gray-600">updated their profile picture.</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Just now</span> · <span>🌐</span>
                </div>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
          <img src={picture} alt="profile" className="w-full object-cover max-h-80" />
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <div className="text-xs text-gray-500">👍 ❤️ 0</div>
            <div className="text-xs text-gray-500">0 comments</div>
          </div>
          <div className="flex px-2 py-1">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>👍</span><span className="text-sm font-semibold">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>💬</span><span className="text-sm font-semibold">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>↗️</span><span className="text-sm font-semibold">Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Birthday post */}
      {birthday && (
        <div className="bg-white mt-2 mb-4">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                {picture ? (
                  <img src={picture} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{(data.firstName || "U")[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{format(birthday, "MMM d, yyyy")}</span> · <span>👥</span>
                </div>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex flex-col items-center py-6 px-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl">🎂</span>
            </div>
            <p className="font-bold text-lg text-gray-900">Born on {format(birthday, "MMMM d, yyyy")}</p>
          </div>
          <div className="flex px-2 py-1 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>👍</span><span className="text-sm font-semibold">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>💬</span><span className="text-sm font-semibold">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <span>↗️</span><span className="text-sm font-semibold">Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}