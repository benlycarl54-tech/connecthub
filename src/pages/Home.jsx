import { useState } from "react";
import { Home as HomeIcon, Users, PlaySquare, Bell, Menu, Search, Plus, MessageCircle, X, ThumbsUp, MessageSquare, Share2, ChevronDown } from "lucide-react";
import { useRegister } from "../context/RegisterContext";

const STORIES = [
  { name: "Your Story", color: "bg-gray-300", emoji: "➕", isYours: true },
  { name: "Alex J.", color: "bg-blue-400", emoji: "🏖️" },
  { name: "Maria G.", color: "bg-pink-400", emoji: "🎂" },
  { name: "David K.", color: "bg-green-400", emoji: "⚽" },
  { name: "Sarah W.", color: "bg-purple-400", emoji: "🌸" },
];

const POSTS = [
  {
    id: 1,
    name: "Alex Johnson",
    initials: "AJ",
    color: "bg-blue-400",
    time: "2h",
    privacy: "Friends",
    content: "Just had the most amazing weekend trip! The views were breathtaking 🌄✨",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    likes: 47,
    comments: 12,
    shares: 3,
  },
  {
    id: 2,
    name: "Maria Garcia",
    initials: "MG",
    color: "bg-pink-400",
    time: "4h",
    privacy: "Public",
    content: "Happy Friday everyone! 🎉 Hope you all have a wonderful weekend ahead. What are your plans?",
    image: null,
    likes: 89,
    comments: 24,
    shares: 7,
  },
  {
    id: 3,
    name: "David Kim",
    initials: "DK",
    color: "bg-green-400",
    time: "Yesterday",
    privacy: "Friends",
    content: "Just finished reading an amazing book. Highly recommend it to everyone who loves adventure stories! 📚",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
    likes: 31,
    comments: 8,
    shares: 2,
  },
];

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="bg-white mb-2">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${post.color} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-sm">{post.initials}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{post.name}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{post.time}</span>
              <span>·</span>
              <span>{post.privacy === "Public" ? "🌐" : "👥"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <span className="text-gray-500 font-bold text-lg leading-none">···</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Post content */}
      <p className="px-4 pb-3 text-sm text-gray-900 leading-relaxed">{post.content}</p>

      {/* Post image */}
      {post.image && (
        <img src={post.image} alt="post" className="w-full object-cover max-h-72" />
      )}

      {/* Reaction summary */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <span className="text-base">👍</span>
            <span className="text-base">❤️</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">{likesCount}</span>
        </div>
        <div className="text-xs text-gray-500">
          {post.comments} comments · {post.shares} shares
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex px-2 py-1">
        <button
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition-colors ${liked ? "text-[#1877F2]" : "text-gray-500"}`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? "fill-[#1877F2] text-[#1877F2]" : ""}`} />
          <span className="text-sm font-semibold">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { data } = useRegister();
  const [activeTab, setActiveTab] = useState(0);
  const [showFriendsBanner, setShowFriendsBanner] = useState(true);

  const avatar = data.profilePicture;
  const firstName = data.firstName || "User";

  const tabs = [
    { icon: HomeIcon },
    { icon: Users },
    { icon: PlaySquare },
    { icon: Bell },
    { icon: Menu },
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
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <Search className="w-5 h-5 text-gray-800" />
            </button>
            <button className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex">
          {tabs.map(({ icon: Icon }, i) => (
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

      {/* Feed */}
      <div className="pb-4">
        {/* Create Post Bar */}
        <div className="bg-white mb-2 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1877F2]">
                  <span className="text-white text-sm font-bold">{firstName[0]?.toUpperCase()}</span>
                </div>
              )}
            </div>
            <button className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-gray-400 text-left text-sm border border-gray-200 hover:bg-gray-200 transition-colors">
              What's on your mind, {firstName}?
            </button>
          </div>
          <div className="flex mt-3 pt-2 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <span className="text-red-400">📹</span>
              <span className="text-sm font-semibold text-gray-600">Live</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <span className="text-green-400">🖼️</span>
              <span className="text-sm font-semibold text-gray-600">Photo</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <span className="text-yellow-400">😊</span>
              <span className="text-sm font-semibold text-gray-600">Feeling</span>
            </button>
          </div>
        </div>

        {/* Stories */}
        <div className="bg-white mb-2 px-3 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {STORIES.map((s, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center" style={{width: 96}}>
                <div className={`w-24 h-36 rounded-xl ${s.color} flex flex-col items-end justify-between p-2 relative overflow-hidden cursor-pointer`}>
                  {s.isYours ? (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1877F2] rounded-full border-2 border-white flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{s.emoji}</span>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center mt-1 truncate w-full">{s.name}</p>
              </div>
            ))}
          </div>

          {/* Friends banner */}
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
        {POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}