import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MoreHorizontal, Camera, Pencil, Plus, ChevronDown, X, LogOut, Shield, Check, AtSign, Share2, BarChart2 } from "lucide-react";
import CreatePost from "./CreatePost";
import { useFBAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useRegister } from "@/context/RegisterContext";
import { format } from "date-fns";
import VerifiedBadge from "@/components/VerifiedBadge";
import PostCard from "@/components/post/PostCard";
import GalleryTab from "@/components/gallery/GalleryTab";
import ProModeModal from "@/components/profile/ProModeModal";

function getUserPosts(userId) {
  try {
    const all = JSON.parse(localStorage.getItem("fb_user_posts") || "[]");
    return all.filter(p => p.authorId === userId);
  } catch { return []; }
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateCurrentUser } = useFBAuth();
  const { data } = useRegister();
  const [activeTab, setActiveTab] = useState("All");
  const [showBanner, setShowBanner] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [postRefresh, setPostRefresh] = useState(0);
  const coverInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const [showProModal, setShowProModal] = useState(false);
  const [isProMode, setIsProMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fb_pro_mode") || "false"); } catch { return false; }
  });

  const user = currentUser || data;
  const fullName = `${user.firstName || "Your"} ${user.lastName || "Name"}`;
  const picture = user.profilePicture;
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.username || "");
  const birthday = user.birthday ? new Date(user.birthday) : null;
  const joinedYear = user.created_date ? new Date(user.created_date).getFullYear() : new Date().getFullYear();

  // Load user's own posts from localStorage every time postRefresh changes
  useEffect(() => {
    if (currentUser?.id) {
      setMyPosts(getUserPosts(currentUser.id));
    }
  }, [currentUser?.id, postRefresh]);

  const handleNewPost = (post) => {
    setPostRefresh(r => r + 1);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
    setPostRefresh(r => r + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const saveUsername = () => {
    const trimmed = usernameInput.trim().replace(/\s+/g, "").toLowerCase();
    if (trimmed) updateCurrentUser({ username: trimmed });
    setEditingUsername(false);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        updateCurrentUser({ coverPhoto: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const [uploadingPic, setUploadingPic] = useState(false);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      const { base44: b44 } = await import("@/api/base44Client");
      const { file_url } = await b44.integrations.Core.UploadFile({ file });
      await updateCurrentUser({ profilePicture: file_url });
    } finally {
      setUploadingPic(false);
    }
  };

  const handleUpgradeToPro = () => {
    setIsProMode(true);
    localStorage.setItem("fb_pro_mode", "true");
    setShowProModal(false);
  };

  const handleShareProfile = () => {
    if (!currentUser?.id) return;
    const profileLink = `${window.location.origin}/user/${currentUser.id}`;
    navigator.clipboard.writeText(profileLink).then(() => {
      alert('Profile link copied to clipboard!');
      setShowMenu(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Top nav */}
      <div className="bg-[#F0F2F5] dark:bg-gray-900 flex items-center justify-between px-3 py-2 sticky top-0 z-40">
        <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
        <div className="flex items-center gap-2 relative">
          <ThemeToggle />
          <button onClick={() => navigate("/search")} className="w-9 h-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow">
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow">
            <MoreHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          {showMenu && (
           <div className="absolute right-0 top-11 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 w-52 z-50 overflow-hidden">
             <button
               onClick={handleShareProfile}
               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
             >
               <Share2 className="w-5 h-5 text-[#1877F2]" />
               <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share profile</span>
             </button>
             {!isProMode ? (
               <button
                 onClick={() => { setShowMenu(false); setShowProModal(true); }}
                 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-t border-gray-100 dark:border-gray-700"
               >
                 <span className="text-lg">⭐</span>
                 <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Switch to Pro mode</span>
               </button>
             ) : (
               <button
                 onClick={() => { setIsProMode(false); localStorage.setItem("fb_pro_mode", "false"); setShowMenu(false); }}
                 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-t border-gray-100 dark:border-gray-700"
               >
                 <span className="text-lg">👤</span>
                 <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Switch to Personal</span>
               </button>
             )}
             {(currentUser?.is_admin || currentUser?.role === 'admin') && (
               <button
                 onClick={() => { setShowMenu(false); navigate("/admin"); }}
                 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-t border-gray-100 dark:border-gray-700"
               >
                 <Shield className="w-5 h-5 text-[#1877F2]" />
                 <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin Panel</span>
               </button>
             )}
             <button
               onClick={() => { setShowMenu(false); handleLogout(); }}
               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-t border-gray-100 dark:border-gray-700"
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
          <div 
            className="w-full h-36 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center relative bg-cover bg-center"
            style={user.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundColor: 'transparent' } : {}}
          >
            {!user.coverPhoto && <span className="text-white/70 text-sm">Add cover photo</span>}
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100"
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
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
                <button 
                onClick={() => !uploadingPic && profilePicInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white hover:bg-gray-300"
              >
                {uploadingPic
                  ? <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-3.5 h-3.5 text-gray-700" />
                }
              </button>
              <input
                ref={profilePicInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              </div>
              <button className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
              {currentUser?.is_verified && <VerifiedBadge size={20} />}
            </div>
            {/* Username row */}
            <div className="flex items-center gap-1 mb-0.5">
              {editingUsername ? (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">@</span>
                  <input
                    autoFocus
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                    className="border border-[#1877F2] rounded-lg px-2 py-0.5 text-sm outline-none w-36"
                    placeholder="username"
                  />
                  <button onClick={saveUsername} className="w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setUsernameInput(user.username || ""); setEditingUsername(true); }} className="flex items-center gap-1 text-sm text-[#1877F2] hover:underline">
                  <AtSign className="w-3.5 h-3.5" />
                  <span>{user.username || "Set username"}</span>
                  <Pencil className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-800 mb-1">
              <span className="font-bold">{formatCount(currentUser?.followers || 0)}</span>
              <span className="text-gray-500"> followers · </span>
              <span className="font-bold">{formatCount(currentUser?.following || 0)}</span>
              <span className="text-gray-500"> following · </span>
              <span className="font-bold">{formatCount(currentUser?.likes || 0)}</span>
              <span className="text-gray-500"> posts</span>
            </p>

            {isProMode && (
              <p className="text-xs text-gray-500 mb-1">Profile · Digital creator</p>
            )}

            <div className="flex gap-2 mt-3">
              {isProMode ? (
                <>
                  <button className="flex-1 bg-[#1877F2] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                    <BarChart2 className="w-4 h-4" /> Dashboard
                  </button>
                  <button onClick={() => navigate("/create-story")} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                    <Plus className="w-4 h-4" /> Add to story
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowCreatePost(true)} className="flex-1 bg-[#1877F2] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                    <Plus className="w-4 h-4" /> Create
                  </button>
                  <button onClick={() => navigate("/edit-profile")} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm">
                    <Pencil className="w-4 h-4" /> Edit profile
                  </button>
                </>
              )}
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
          {["All", "Photos", "Gallery", "Reels"].map(tab => (
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

      {/* Gallery Tab */}
      {activeTab === "Gallery" && (
        <div className="px-4 py-4">
          <GalleryTab userId={currentUser?.id} />
        </div>
      )}

      {/* Personal details */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-gray-900">Personal details</h2>
          <button onClick={() => navigate("/edit-profile")}><Pencil className="w-4 h-4 text-gray-500" /></button>
        </div>
        {currentUser?.currentCity && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">📍</span>
            <span className="text-gray-800 text-sm">{currentUser.currentCity}</span>
          </div>
        )}
        {currentUser?.hometown && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🏠</span>
            <span className="text-gray-800 text-sm">{currentUser.hometown}</span>
          </div>
        )}
        {currentUser?.relationshipStatus && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💕</span>
            <span className="text-gray-800 text-sm">{currentUser.relationshipStatus}</span>
          </div>
        )}
        {currentUser?.highSchool && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🎓</span>
            <span className="text-gray-800 text-sm">{currentUser.highSchool}</span>
          </div>
        )}
        {currentUser?.workExperience && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💼</span>
            <span className="text-gray-800 text-sm">{currentUser.workExperience}</span>
          </div>
        )}
        {birthday && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🎂</span>
            <span className="text-gray-800 text-sm">{format(birthday, "MMMM d, yyyy")}</span>
          </div>
        )}
        {user.gender && (
          <div className="flex items-center gap-3">
            <span className="text-xl">👤</span>
            <span className="text-gray-800 text-sm capitalize">{user.gender}</span>
          </div>
        )}
      </div>

      {/* Interests/Hobbies */}
      {(currentUser?.hobbies?.length > 0 || currentUser?.music?.length > 0 || currentUser?.sports?.length > 0) && (
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="font-bold text-base text-gray-900 mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {[...(currentUser?.hobbies || []), ...(currentUser?.music || []), ...(currentUser?.sports || [])].map((interest, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-900">{interest}</span>
            ))}
          </div>
        </div>
      )}

      {/* Friends */}
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
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-left text-gray-400 text-sm border border-gray-200"
          >
            What's on your mind?
          </button>
        </div>
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button onClick={() => setShowCreatePost(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">🎬 Reel</button>
          <button onClick={() => navigate("/live")} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700">📹 Live</button>
        </div>
      </div>

      {/* Profile picture auto-post */}
      {picture && myPosts.length === 0 && (
        <div className="bg-white mt-2">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                <img src={picture} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
                  {currentUser?.is_verified && <VerifiedBadge size={14} />}
                </div>
                <p className="text-gray-600 text-xs">updated their profile picture · Just now · 🌐</p>
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

      {/* User's actual posts */}
      {myPosts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          authorName={fullName}
          authorAvatar={picture}
          authorVerified={currentUser?.is_verified}
          authorId={currentUser?.id}
        />
      ))}

      {/* Manage posts — pro mode */}
      {isProMode && (
        <div className="bg-white mt-2 px-4 py-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50">
            <BarChart2 className="w-4 h-4" /> Manage posts
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="bg-white mt-2 mb-2 px-4 py-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>

      {showCreatePost && <CreatePost onClose={handleCloseCreatePost} onPost={handleNewPost} />}
      {showProModal && (
        <ProModeModal
          user={{ ...user, ...currentUser }}
          onClose={() => setShowProModal(false)}
          onUpgrade={handleUpgradeToPro}
        />
      )}
    </div>
  );
}