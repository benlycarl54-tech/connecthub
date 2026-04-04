import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, Users, PlaySquare, Bell, Menu, Search, Plus, MessageCircle, Shield, X } from "lucide-react";
import { useRegister } from "../context/RegisterContext";
import { useFBAuth } from "../context/AuthContext";
import { FEED_POSTS } from "../data/feedPosts";
import PostCard from "../components/post/PostCard";
import CreatePost from "./CreatePost";
import MenuDrawer from "../components/MenuDrawer";

// Interleave video posts (id >= 101) every 2 regular posts for a natural feed mix
const REGULAR_POSTS = FEED_POSTS.filter(p => p.id < 101);
const VIDEO_POSTS = FEED_POSTS.filter(p => p.id >= 101);
const MIXED_FEED = [];
VIDEO_POSTS.forEach((vp, i) => {
  if (REGULAR_POSTS[i * 2]) MIXED_FEED.push(REGULAR_POSTS[i * 2]);
  if (REGULAR_POSTS[i * 2 + 1]) MIXED_FEED.push(REGULAR_POSTS[i * 2 + 1]);
  MIXED_FEED.push(vp);
});

function getLiveState() {
  try { return JSON.parse(localStorage.getItem("fb_live_state") || "null"); } catch { return null; }
}
function getUserStories() {
  try { return JSON.parse(localStorage.getItem("fb_user_stories") || "[]"); } catch { return []; }
}

const BASE_STORIES = [
  { name: "James W.", bg: "bg-blue-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/7794178bb_4a796f6c9319edce10116c468a764a72.jpg", time: "2h" },
  { name: "Patricia M.", bg: "bg-pink-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/79630d9e5_19aa7f9a156745f518f32a27306b274b.jpg", time: "3h" },
  { name: "Kevin O.", bg: "bg-teal-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/33f3503a9_7e0fd98ce54a822d3223901ce34c33d7.jpg", time: "4h" },
  { name: "Linda S.", bg: "bg-purple-400", img: "https://media.base44.com/images/public/69d064686cc19a99ff8b2dc7/ca1e07b51_73559b69b620d54a4498159de7c42056.jpg", time: "5h" },
];

export default function Home() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const { currentUser } = useFBAuth();
  const [showFriendsBanner, setShowFriendsBanner] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [liveActive, setLiveActive] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [lastPollTime, setLastPollTime] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const { getFriends } = useFBAuth();

  const avatar = currentUser?.profilePicture || data.profilePicture;
  const firstName = currentUser?.firstName || data.firstName || "User";
  const friendIds = getFriends().map(f => f.id);

  // Poll for live state and new posts every 5s
  useEffect(() => {
    const pollNewPosts = () => {
      setLiveActive(!!getLiveState()?.isLive);
      
      try {
        const allPosts = JSON.parse(localStorage.getItem("fb_user_posts") || "[]");
        const currentTime = Date.now();
        const newPosts = allPosts.filter(p => p.created_at > lastPollTime && p.authorId !== currentUser?.id);
        
        if (newPosts.length > 0) {
          const sorted = newPosts.sort((a, b) => {
            const aIsFriend = friendIds.includes(a.authorId);
            const bIsFriend = friendIds.includes(b.authorId);
            if (aIsFriend && !bIsFriend) return -1;
            if (!aIsFriend && bIsFriend) return 1;
            return b.created_at - a.created_at;
          });
          setFeedPosts(prev => [...sorted, ...prev]);
          setLastPollTime(currentTime);
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    };

    pollNewPosts();
    const interval = setInterval(pollNewPosts, 5000);
    return () => clearInterval(interval);
  }, [currentUser?.id, lastPollTime, friendIds]);

  const handleNewPost = (post) => {
    setUserPosts(prev => [post, ...prev]);
  };

  // Merge user stories with base stories
  const myStoriesRaw = getUserStories().filter(s => s.userId === currentUser?.id);
  const allStories = [...BASE_STORIES, ...getUserStories().filter(s => s.userId !== currentUser?.id)];

  const openStories = (startIndex) => {
    navigate("/story-viewer", { state: { stories: allStories, startIndex } });
  };

  const [notifCount, setNotifCount] = useState(() => {
    try {
      const uid = currentUser?.id;
      if (!uid) return 0;
      return JSON.parse(localStorage.getItem(`fb_notifications_${uid}`) || "[]").filter(n => !n.read).length;
    } catch { return 0; }
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 pt-3 pb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMenu(true)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Menu className="w-5 h-5 text-gray-800" />
            </button>
            <span className="text-[#1877F2] font-bold text-2xl" style={{ fontFamily: "Georgia, serif" }}>
              facebook
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Plus className="w-5 h-5 text-gray-800" />
            </button>
            <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Search className="w-5 h-5 text-gray-800" />
            </button>
            <button onClick={() => navigate("/messages")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 relative">
              <MessageCircle className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Tab bar - Home, Friends, Groups, Videos, Notifications */}
        <div className="flex border-t border-gray-200">
          <button className="flex-1 flex items-center justify-center py-2.5 border-b-[3px] border-[#1877F2] text-[#1877F2]">
            <HomeIcon className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/friends")} className="flex-1 flex items-center justify-center py-2.5 border-b-[3px] border-transparent text-gray-400 hover:bg-gray-50">
            <Users className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/groups")} className="flex-1 flex items-center justify-center py-2.5 border-b-[3px] border-transparent text-gray-400 hover:bg-gray-50">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/videos")} className="flex-1 flex items-center justify-center py-2.5 border-b-[3px] border-transparent text-gray-400 hover:bg-gray-50">
            <PlaySquare className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/notifications")} className="flex-1 flex items-center justify-center py-2.5 border-b-[3px] border-transparent text-gray-400 hover:bg-gray-50 relative">
            <Bell className="w-6 h-6" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-[22%] w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Live Banner */}
      {liveActive && (
        <button
          onClick={() => navigate("/live")}
          className="w-full bg-red-600 flex items-center justify-center gap-2 py-2.5 z-30"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm">Admin is LIVE — Tap to watch 🔴</span>
        </button>
      )}

      {/* Feed */}
      <div className="pb-24">
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
              onClick={() => { if (currentUser?.is_admin) navigate("/live"); }}
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
              onClick={() => navigate("/create-story")}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <span className="text-yellow-400">📖</span>
              <span className="text-sm font-semibold text-gray-600">Story</span>
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="bg-white mb-2 px-3 py-3 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {/* Your Story card */}
            <div className="flex-shrink-0 flex flex-col items-center w-24">
              <div
                className="w-24 h-36 rounded-xl overflow-hidden relative cursor-pointer bg-gray-200"
                onClick={() => navigate("/create-story")}
              >
                {avatar ? (
                  <img src={avatar} alt="me" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 bg-gradient-to-t from-black/30 to-transparent">
                  <div className="w-8 h-8 bg-[#1877F2] rounded-full border-2 border-white flex items-center justify-center mb-1">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center mt-1 truncate w-full">Your Story</p>
            </div>

            {/* Other stories */}
            {allStories.map((s, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center w-24">
                <div
                  className={`w-24 h-36 rounded-xl overflow-hidden relative cursor-pointer ${s.bg || "bg-gray-400"}`}
                  onClick={() => openStories(i)}
                >
                  {s.img && <img src={s.img} alt={s.name} className="w-full h-full object-cover" />}
                  {s.content && !s.img && (
                    <div className={`w-full h-full flex items-center justify-center ${s.bg} p-2`}>
                      <p className="text-white text-xs font-bold text-center line-clamp-4">{s.content}</p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-[#1877F2] overflow-hidden">
                    {s.avatar ? (
                      <img src={s.avatar} alt="" className="w-full h-full object-cover" />
                    ) : s.img ? (
                      <img src={s.img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${s.bg || "bg-blue-500"} flex items-center justify-center`}>
                        <span className="text-white text-[9px] font-bold">{s.name?.[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
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

        {/* User's own new posts */}
         {userPosts.map(post => (
           <PostCard key={post.id} post={post} authorName={post.name} authorAvatar={post.avatar} authorVerified={post.verified} authorId={post.authorId} />
         ))}

         {/* Real-time feed posts from other users */}
         {feedPosts.map(post => (
           <PostCard key={post.id} post={post} authorName={post.author_name} authorAvatar={post.author_avatar} authorId={post.authorId} />
         ))}

         {/* Mixed feed posts */}
         {MIXED_FEED.map(post => (
           <PostCard key={post.id} post={post} />
         ))}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} onPost={handleNewPost} />
      )}

      {/* Menu Drawer */}
      <MenuDrawer isOpen={showMenu} onClose={() => setShowMenu(false)} />
    </div>
  );
}