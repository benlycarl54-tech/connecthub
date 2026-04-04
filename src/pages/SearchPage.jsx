import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

export default function SearchPage() {
  const navigate = useNavigate();
  const { searchUsers, currentUser } = useFBAuth();
  const [query, setQuery] = useState("");
  const results = query.trim() ? searchUsers(query) : [];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Search header */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 sticky top-0 bg-white z-40">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            autoFocus
            placeholder="Search Facebook"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-900"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-16 px-6">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold text-gray-900 text-lg">No results for "{query}"</p>
              <p className="text-gray-500 text-sm text-center mt-1">Try searching for people, pages, groups, posts or videos.</p>
            </div>
          ) : (
            <div>
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">People</p>
              {results.map(user => (
                <button
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{user.firstName?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 text-sm">{user.firstName} {user.lastName}</span>
                      {user.is_verified && <span className="text-[#1877F2] text-xs">✔</span>}
                    </div>
                    <p className="text-xs text-gray-500">
                      {user.followers || 0} followers
                      {user.id === currentUser?.id ? " · You" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent searches</p>
          <p className="text-sm text-gray-400">No recent searches</p>
        </div>
      )}
    </div>
  );
}