import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, Camera, Pencil, Plus, ChevronDown, X, LogOut, Shield } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { useRegister } from "@/context/RegisterContext";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useFBAuth();
  const { data } = useRegister();
  const [activeTab, setActiveTab] = useState("All");
  const [showBanner, setShowBanner] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Use currentUser if logged in via real auth, fallback to register context
  const user = currentUser || data;
  const fullName = `${user.firstName || "Your"} ${user.lastName || "Name"}`;
  const picture = user.profilePicture;
  const birthday = user.birthday ? new Date(user.birthday) : null;
  const joinedYear = user.created_date ? new Date(user.created_date).getFullYear() : new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Top nav */}
      <div className="bg-[#F0F2F5] flex items-center justify-between px-3 py-2 sticky top-0 z-40">
        <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex items-center gap-2 relative">
          <button onClick={() => navigate("/search")} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-11 bg-white rounded-xl shadow-xl border border-gray-100 w-52 z-50 overflow-hidden">
              {currentUser?.is_admin && (
                <button
                  onClick={() => { setShowMenu(false); navigate("/admin"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <Shield className="w-5 h-5 text-[#1877F2]" />
                  <span className="text-sm font-semibold text-gray-900">Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-t border-gray-100"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-500">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cover + Avatar area */}
      <div className="bg-white">
        <div className="relative">
          <div className="w-full h-36 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center relative">
            <span className="text-white/70 text-sm">Add cover photo</span>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="px-4 pb-3">
            <div className="flex items-end justify-between -mt-12 mb-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow">
                  {picture ? (
                    <img src={picture} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">{(user.firstName || "U")[0]}</span>
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

            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
              {currentUser?.is_verified && (
                <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">
              {currentUser?.followers || 0} followers · {currentUser?.following || 0} following
            </p>

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

        <div className="flex border-t border-gray-200 px-2">
          {["All", "Photos", "Reels"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Personal details */}
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
        {user.emailAddress && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">✉️</span>
            <span className="text-gray-800 text-sm">{user.emailAddress}</span>
          </div>
        )}
        {user.mobileNumber && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">📱</span>
            <span className="text-gray-800 text-sm">{user.mobileNumber}</span>
          </div>
        )}
        {user.gender && (
          <div className="flex items-center gap-3">
            <span className="text-xl">👤</span>
            <span className="text-gray-800 text-sm capitalize">{user.gender}</span>
          </div>
        )}
      </div>

      {/* Friends */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-900">Friends</h2>
          <span className="text-[#1877F2] font-semibold text-sm">See all</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">No friends yet. Start adding people you know!</p>
      </div>

      {/* All posts */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-gray-900">All posts</h2>
          <span className="text-[#1877F2] font-semibold text-sm">Filters</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            {picture ? (
              <img src={picture} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-sm font-bold">{(user.firstName || "U")[0]}</span>
              </div>
            )}
          </div>
          <button className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-left text-gray-400 text-sm border border-gray-200">
            What's on your mind?
          </button>
        </div>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">🎬 Reel</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">📹 Live</button>
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
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
                  {currentUser?.is_verified && (
                    <div className="w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                <p className="font-normal text-gray-600 text-xs">updated their profile picture · Just now · 🌐</p>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
          <img src={picture} alt="profile" className="w-full object-cover max-h-80" />
          <div className="flex px-2 py-1 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">👍 Like</button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">💬 Comment</button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">↗️ Share</button>
          </div>
        </div>
      )}

      {/* Birthday post */}
      {birthday && (
        <div className="bg-white mt-2 mb-4">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                {picture ? <img src={picture} alt="avatar" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{(user.firstName || "U")[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
                <p className="text-xs text-gray-500">{format(birthday, "MMM d, yyyy")} · 👥</p>
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
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">👍 Like</button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">💬 Comment</button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 text-sm font-semibold">↗️ Share</button>
          </div>
        </div>
      )}

      {/* Logout button at bottom */}
      <div className="bg-white mt-2 mb-6 px-4 py-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
        {currentUser?.is_admin && (
          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center justify-center gap-2 py-3 border border-blue-200 rounded-xl text-[#1877F2] font-semibold text-sm hover:bg-blue-50 transition-colors mt-2"
          >
            <Shield className="w-4 h-4" /> Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}