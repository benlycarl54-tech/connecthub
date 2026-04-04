import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, Users, PlaySquare, Bell, Menu, Search, Plus, MessageCircle, Shield, X, Radio } from "lucide-react";
import { useRegister } from "../context/RegisterContext";
import { useFBAuth } from "../context/AuthContext";
import { FEED_POSTS } from "../data/feedPosts";
import PostCard from "../components/post/PostCard";
import CreatePost from "./CreatePost";

const BASE_STORIES = [
  { name: "James W.", bg: "bg-blue-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/7794178bb_4a796f6c9319edce10116c468a764a72.jpg" },
  { name: "Patricia M.", bg: "bg-pink-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/79630d9e5_19aa7f9a156745f518f32a27306b274b.jpg" },
  { name: "Kevin O.", bg: "bg-teal-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/33f3503a9_7e0fd98ce54a822d3223901ce34c33d7.jpg" },
  { name: "Linda S.", bg: "bg-purple-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/ca1e07b51_73559b69b620d54a4498159de7c42056.jpg" },
];

function getLiveState() {
  try { return JSON.parse(localStorage.getItem("fb_live_state") || "null"); } catch { return null; }
}
function getUserStories() {
  try { return JSON.parse(localStorage.getItem("fb_user_stories") || "[]"); } catch { return []; }
}

export default function Home() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const { currentUser } = useFBAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showFriendsBanner, setShowFriendsBanner] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [liveActive, setLiveActive] = useState(false);
  const [userStories, setUserStories] = useState([]);

  const avatar = currentUser?.profilePicture || data.profilePicture;
  const firstName = currentUser?.firstName || data.firstName || "User";

  const tabs = [HomeIcon, Users, PlaySquare, Bell, Menu];

  useEffect(() => {
    setLiveActive(!!getLiveState()?.isLive);
    setUserStories(getUserStories());
    const interval = setInterval(() => {
      setLiveActive(!!getLiveState()?.isLive);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNewPost = (post) => {
    setUserPosts(prev => [post, ...prev]);
  };

  const allPosts = [...userPosts, ...FEED_POSTS];

  // Merge stories: user stories first, then base stories
  const allStories = [
    ...userStories.slice(0, 3).map(s => ({ ...s, isUser: true })),
    ...BASE_STORIES,
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          <span className="text-[#1877F2] font-bold text-2xl" style={{fontFamily: 'Georgia, serif'}}>
            facebook
          </span>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Plus className="w-5 h-5 text-gray-800" />
            </button>
            <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Search className="w-5 h-5 text-gray-800" />
            </button>
            {currentUser?.is_admin && (
              <button onClick={() => navigate("/admin")} className="w-9 h-9 bg-[#1877F2] rounded-full flex items-center justify-center hover:bg-[#166FE5]">
                <Shield className="w-4 h-4 text-white" />
              </button>
            )}
            <button onClick={() => navigate("/messages")} className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex">
          {tabs.map((Icon, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 flex items-center justify-center py-2.5 border-b-[3px] transition-colors ${
                activeTab === i ? "border-[#1877F2] text-[#1877F2]" : "border-transparent text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </header>

      {/* Live banner */}
      {liveActive && (
        <button
          onClick={() => navigate("/live")}
          className="w-full bg-red-600 flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm"
        >
          <Radio className="w-4 h-4" />
          <span>Admin is LIVE now — Tap to watch!</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </button>
      )}

      {/* Feed */}
      <div className="pb-4">
        {/* Create Post Bar */}
        <div className="bg-white mb-2 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{firstName[0]?.toUpperCase()}</span>
                </div>
              )}
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-left text-gray-400 text-sm border border-gray-200"
            >
              What's on your mind, {firstName}?
            </button>
          </div>
          <div className="flex mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => navigate("/live")}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <span className="text-red-400">📹</span>
              <span className="text-sm font-semibold text-gray-600">Live</span>
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <span className="text-green-500">🖼️</span>
              <span className="text-sm font-semibold text-gray-600">Photo</span>
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <span className="text-yellow-400">😊</span>
              <span className="text-sm font-semibold text-gray-600">Feeling</span>
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="bg-white mb-2 px-3 py-3 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {/* Your Story */}
            <div className="flex-shrink-0 flex flex-col items-center w-24">
              <button
                onClick={() => navigate("/create-story")}
                className="w-24 h-36 rounded-xl overflow-hidden relative bg-gray-200"
              >
                {avatar ? (
                  <img src={avatar} alt="you" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 bg-gradient-to-t from-black/20 to-transparent">
                  <div className="w-8 h-8 bg-[#1877F2] rounded-full border-2 border-white flex items-center justify-center mb-1">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </button>
              <p className="text-xs font-semibold text-gray-700 text-center mt-1 truncate w-full">Your Story</p>
            </div>

            {/* Other stories */}
            {allStories.map((s, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center w-24">
                <button
                  onClick={() => navigate("/story-viewer", { state: { stories: allStories, startIndex: i } })}
                  className={`w-24 h-36 rounded-xl overflow-hidden relative cursor-pointer ${s.bg || "bg-gray-400"}`}
                >
                  {s.img && <img src={s.img} alt={s.name} className="w-full h-full object-cover" />}
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-[#1877F2] overflow-hidden">
                    {s.img ? (
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${s.bg} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{s.name[0]}</span>
                      </div>
                    )}
                  </div>
                  {s.content && (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <p className="text-white text-xs font-bold text-center line-clamp-4">{s.content}</p>
                    </div>
                  )}
                </button>
                <p className="text-xs font-semibold text-gray-700 text-center mt-1 truncate w-full">{s.name}</p>
              </div>
            ))}
          </div>

          {showFriendsBanner && (
            <div className="mt-3 border border-gray-200 rounded-xl p-3 relative">
              <button onClick={() => setShowFriendsBanner(false)} className="absolute top-2 right-2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
              <p className="font-bold text-sm text-gray-900 mb-1">📲 Facebook is better with friends</p>
              <p className="text-xs text-gray-500 mb-2">See stories and posts from friends by adding people you know.</p>
              <button className="text-[#1877F2] font-semibold text-sm">Find friends</button>
            </div>
          )}
        </div>

        {/* Posts */}
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} onPost={handleNewPost} />
      )}
    </div>
  );
}