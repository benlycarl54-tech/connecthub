import { useState, useEffect } from "react";
import { Search, UserPlus, Check, X, ChevronLeft } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FriendsPage() {
  const navigate = useNavigate();
  const { getAllUsers, currentUser, getFriendRequests, getFriends, sendFriendRequest, acceptFriendRequest, declineFriendRequest, isFriend, hasPendingRequest } = useFBAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [requestStatus, setRequestStatus] = useState({}); // id -> "sent" | "friend"
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [reqs, frds, allUsers] = await Promise.all([
      getFriendRequests(),
      getFriends(),
      getAllUsers(),
    ]);
    setRequests(reqs);
    setFriends(frds);
    const friendIds = new Set(frds.map(f => f.id));
    const reqFromIds = new Set(reqs.map(r => r.from_user_id));
    const sugg = allUsers.filter(u => u.id !== currentUser?.id && !u.id?.startsWith("feed_") && !friendIds.has(u.id) && !reqFromIds.has(u.id));
    setSuggestions(sugg);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  const handleSendRequest = async (user) => {
    setRequestStatus(prev => ({ ...prev, [user.id]: "sent" }));
    await sendFriendRequest(user.id);
  };

  const handleAccept = async (req) => {
    await acceptFriendRequest(req.id);
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setFriends(prev => [...prev, { id: req.from_user_id, firstName: req.from_first_name, lastName: req.from_last_name, profilePicture: req.from_avatar }]);
  };

  const handleDecline = async (req) => {
    await declineFriendRequest(req.id);
    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1877F2] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")} className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Friends</h1>
          </div>
          <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 pb-3">
          <button
            onClick={() => setActiveTab("requests")}
            className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === "requests" ? "bg-blue-100 text-[#1877F2]" : "bg-gray-100 text-gray-700"}`}
          >
            Friend requests
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === "friends" ? "bg-blue-100 text-[#1877F2]" : "bg-gray-100 text-gray-700"}`}
          >
            Your friends
          </button>
        </div>
        <div className="border-t border-gray-100" />
      </div>

      {activeTab === "requests" && (
        <div className="px-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-36 h-44 bg-gradient-to-b from-blue-300 to-blue-500 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-md">
                <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-700"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </div>
                </div>
                <div className="w-16 h-1.5 bg-blue-700 rounded-full mb-1.5" />
                <div className="w-10 h-1.5 bg-blue-700 rounded-full" />
              </div>
              <p className="text-lg font-bold text-gray-900 mb-2">No new requests</p>
              <p className="text-sm text-gray-500 text-center px-4 leading-relaxed">
                When someone sends you a friend request, it will appear here.
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="font-bold text-gray-900">Friend requests ({requests.length})</p>
              {requests.map((req) => {
                const name = `${req.from_first_name || ""} ${req.from_last_name || ""}`.trim();
                return (
                  <div key={req.id} className="flex items-center gap-3">
                    <button onClick={() => navigate(`/user/${req.from_user_id}`)} className="w-16 h-16 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {req.from_avatar ? (
                        <img src={req.from_avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-white text-2xl font-bold">{name?.[0]}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400">Sent you a friend request</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleAccept(req)} className="flex-1 bg-[#1877F2] text-white font-semibold py-1.5 rounded-lg text-sm">Confirm</button>
                        <button onClick={() => handleDecline(req)} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-1.5 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* People you may know */}
          {suggestions.length > 0 && (
            <div className="py-4">
              <p className="font-bold text-gray-900 mb-4">People you may know</p>
              <div className="space-y-5">
                {suggestions.slice(0, 10).map((user) => {
                  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
                  const status = requestStatus[user.id];
                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <button onClick={() => navigate(`/user/${user.id}`)} className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-white text-xl font-bold">{name?.[0]}</span>
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{name}</p>
                        <button
                          onClick={() => handleSendRequest(user)}
                          disabled={status === "sent"}
                          className={`mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${status === "sent" ? "bg-gray-100 text-gray-500" : "bg-[#E7F3FF] text-[#1877F2]"}`}
                        >
                          {status === "sent" ? <><Check className="w-3.5 h-3.5" /> Request sent</> : <><UserPlus className="w-3.5 h-3.5" /> Add friend</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "friends" && (
        <div className="px-4 py-4">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-5xl">👥</span>
              </div>
              <p className="font-bold text-gray-900">No friends yet</p>
              <p className="text-sm text-gray-500 text-center mt-1 px-6">Accept friend requests to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {friends.map((f) => {
                const name = `${f.firstName || ""} ${f.lastName || ""}`.trim();
                return (
                  <div key={f.id} className="flex items-center gap-3">
                    <button onClick={() => navigate(`/user/${f.id}`)} className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {f.profilePicture ? (
                        <img src={f.profilePicture} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-white text-xl font-bold">{name?.[0]}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">Friends</p>
                    </div>
                    <button onClick={() => navigate("/messages", { state: { startChatWith: f } })} className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">Message</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}