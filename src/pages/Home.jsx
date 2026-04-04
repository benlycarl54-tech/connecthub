import { useState } from "react";
import { Home as HomeIcon, Users, PlaySquare, Bell, Menu, Search, Plus, MessageCircle, X } from "lucide-react";
import { useRegister } from "../context/RegisterContext";

export default function Home() {
  const { data } = useRegister();
  const [showFriendsBanner, setShowFriendsBanner] = useState(true);
  const [showFriendsCTA, setShowFriendsCTA] = useState(true);

  const avatar = data.profilePicture;
  const firstName = data.firstName || "User";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[#1877F2] font-bold text-2xl" style={{fontFamily: 'Helvetica Neue, Arial'}}>facebook</span>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex mt-1">
          {[
            { icon: HomeIcon, active: true },
            { icon: Users, active: false },
            { icon: PlaySquare, active: false },
            { icon: Bell, active: false },
            { icon: Menu, active: false },
          ].map(({ icon: Icon, active }, i) => (
            <button
              key={i}
              className={`flex-1 flex items-center justify-center py-2 border-b-2 ${active ? "border-[#1877F2]" : "border-transparent"}`}
            >
              <Icon className={`w-6 h-6 ${active ? "text-[#1877F2]" : "text-gray-500"}`} />
            </button>
          ))}
        </div>
      </header>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {/* Create post bar */}
        <div className="bg-white mb-2 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-400">
                  <span className="text-white text-sm font-bold">{firstName[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-gray-400 text-base">
              What's on your mind?
            </div>
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🖼️</span>
            </div>
          </div>
        </div>

        {/* Stories + Friends banner */}
        <div className="bg-white mb-2 px-3 py-3">
          <div className="flex gap-3 items-start">
            {/* Create story card */}
            <div className="w-24 flex-shrink-0">
              <div className="w-24 h-32 bg-gray-200 rounded-xl flex flex-col items-center justify-end pb-2 relative overflow-hidden">
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1877F2] rounded-full border-2 border-white flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center mt-1">Create story</p>
            </div>

            {/* Friends banner */}
            {showFriendsBanner && (
              <div className="flex-1 border border-gray-200 rounded-xl p-3 relative">
                <button
                  onClick={() => setShowFriendsBanner(false)}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-[#1877F2] flex items-center justify-center">
                    <span className="text-lg">📹</span>
                  </div>
                  <span className="text-2xl">🙌</span>
                </div>
                <p className="font-bold text-sm text-gray-900 mb-1">Facebook is better with friends</p>
                <p className="text-xs text-gray-500 mb-3">See stories from friends by adding people you know from your contacts.</p>
                <button className="text-[#1877F2] font-semibold text-sm">Find friends</button>
              </div>
            )}
          </div>
        </div>

        {/* Find friends CTA */}
        {showFriendsCTA && (
          <div className="bg-white mb-2 px-4 py-4 relative">
            <button onClick={() => setShowFriendsCTA(false)} className="absolute top-3 right-3">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex flex-col items-center text-center py-2">
              <span className="text-4xl mb-3">👥</span>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Want to see more posts from friends?</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Add more friends to see their posts in your Feed when they accept your friend request.
              </p>
              <div className="flex gap-3 w-full">
                <button className="flex-1 bg-[#1877F2] text-white font-semibold py-2.5 rounded-md text-sm">
                  Find friends
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-md text-sm">
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty post skeleton */}
        <div className="bg-white mb-2 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
              <div className="h-2 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}