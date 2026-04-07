import { useState, useRef, useEffect } from "react";
import { Search, X, UserPlus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function GlobalSearchBar() {
  const navigate = useNavigate();
  const { searchUsers, currentUser, followUser, isFollowing } = useFBAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [followedIds, setFollowedIds] = useState({});
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const showDropdown = focused && query.trim().length >= 1;

  // Async search with debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const found = await searchUsers(query);
      setResults(found || []);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFollow = (e, user) => {
    e.stopPropagation();
    if (!currentUser || user.id === currentUser.id) return;
    const nowFollowing = followUser(user.id);
    setFollowedIds(prev => ({ ...prev, [user.id]: nowFollowing }));
  };

  const isUserFollowing = (userId) => {
    if (userId in followedIds) return followedIds[userId];
    return isFollowing(userId);
  };

  const handleSelect = (user) => {
    setQuery("");
    setFocused(false);
    if (user.id === currentUser?.id) navigate("/profile");
    else navigate(`/user/${user.id}`);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[220px]">
      {/* Input */}
      <div className={`flex items-center gap-2 bg-fb-gray rounded-full px-3 py-2 transition-all ${focused ? "ring-2 ring-fb-blue/40" : ""}`}>
        <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Facebook"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder-gray-500 w-full"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm font-semibold text-gray-700">No results for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different name or email</p>
            </div>
          ) : (
            <>
              <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wide">People</p>
              {results.slice(0, 6).map(user => {
                const isMe = user.id === currentUser?.id;
                const following = isUserFollowing(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelect(user)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                          <span className="text-white font-bold text-base">{user.firstName?.[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        {user.is_verified && <VerifiedBadge size={13} />}
                        {isMe && <span className="text-xs text-gray-400">(You)</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {user.username ? `@${user.username} · ` : ""}
                        {(user.followers || 0).toLocaleString()} followers
                      </p>
                    </div>

                    {/* Follow button */}
                    {!isMe && (
                      <button
                        onClick={(e) => handleFollow(e, user)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                          following ? "bg-gray-100 text-gray-700" : "bg-[#1877F2] text-white"
                        }`}
                      >
                        {following ? <><Check className="w-3 h-3" /> Following</> : <><UserPlus className="w-3 h-3" /> Follow</>}
                      </button>
                    )}
                  </div>
                );
              })}
              {results.length > 6 && (
                <button
                  onClick={() => { navigate("/search"); setFocused(false); }}
                  className="w-full px-4 py-3 text-sm font-semibold text-[#1877F2] hover:bg-gray-50 text-center border-t border-gray-100"
                >
                  See all results for "{query}"
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}