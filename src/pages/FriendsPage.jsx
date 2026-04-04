import { useState, useEffect } from "react";
import { Search, UserPlus, Check, X } from "lucide-react";
import { useFBAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/home/BottomTabBar";

const SUGGESTED = [
  { id: "s1", name: "Amara Johnson", mutual: 3, bg: "bg-pink-400" },
  { id: "s2", name: "Kofi Mensah", mutual: 5, bg: "bg-blue-500" },
  { id: "s3", name: "Fatima Al-Hassan", mutual: 2, bg: "bg-teal-500" },
  { id: "s4", name: "David Osei", mutual: 7, bg: "bg-orange-400" },
  { id: "s5", name: "Ngozi Williams", mutual: 1, bg: "bg-purple-500" },
  { id: "s6", name: "Emmanuel Darko", mutual: 4, bg: "bg-green-500" },
  { id: "s7", name: "Ama Boateng", mutual: 6, bg: "bg-red-400" },
  { id: "s8", name: "Kwame Asante", mutual: 2, bg: "bg-yellow-500" },
  { id: "s9", name: "Abena Frimpong", mutual: 3, bg: "bg-indigo-400" },
  { id: "s10", name: "Yaw Mensah", mutual: 8, bg: "bg-rose-400" },
];

export default function FriendsPage() {
  const navigate = useNavigate();
  const { getAllUsers, currentUser, getFriendRequests, getFriends: getContextFriends, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getUserById } = useFBAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [added, setAdded] = useState({});
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setRequests(getFriendRequests());
    setFriends(getContextFriends());
  }, []);

  const allUsers = getAllUsers().filter(u => u.id !== currentUser?.id).slice(0, 6);

  const sendRequest = (user) => {
    const uid = user.id || user.name;
    if (added[uid]) return;
    sendFriendRequest(uid);
    setAdded(prev => ({ ...prev, [uid]: true }));
  };

  const acceptRequest = (user) => {
    acceptFriendRequest(user.id);
    setRequests(prev => prev.filter(r => r.id !== user.id));
    setFriends(prev => [...prev, user]);
  };

  const declineRequest = (user) => {
    declineFriendRequest(user.id);
    setRequests(prev => prev.filter(r => r.id !== user.id));
  };

  const suggestions = [...allUsers, ...SUGGESTED];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">☰</span>
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
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${activeTab === "requests" ? "bg-blue-100 text-[#1877F2] border-transparent" : "bg-gray-100 text-gray-700 border-transparent"}`}
          >
            Friend requests
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${activeTab === "friends" ? "bg-blue-100 text-[#1877F2] border-transparent" : "bg-gray-100 text-gray-700 border-transparent"}`}
          >
            Your friends
          </button>
        </div>
        <div className="border-t border-gray-100" />
      </div>

      {activeTab === "requests" && (
        <div className="px-4">
           {requests.length === 0 ? (
            /* Empty state — matches screenshot exactly */
            <div className="flex flex-col items-center justify-center py-16">
              {/* Blue card icon */}
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
              <p className="text-sm text-gray-500 text-center mb-6 px-4 leading-relaxed">
                Try uploading your phone contacts so you can find your friends on Facebook.
              </p>
              <button className="px-8 py-2.5 bg-blue-50 text-[#1877F2] font-semibold rounded-full text-sm">
                Upload contacts
              </button>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="font-bold text-gray-900">Friend requests ({requests.length})</p>
              {requests.map((req) => {
                const name = req.firstName ? `${req.firstName} ${req.lastName || ""}`.trim() : req.name;
                return (
                  <div key={req.id} className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-full ${req.bg || "bg-blue-500"} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      {req.profilePicture ? <img src={req.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                        <span className="text-white text-2xl font-bold">{name?.[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400">Recently</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => acceptRequest(req)} className="flex-1 bg-[#1877F2] text-white font-semibold py-1.5 rounded-lg text-sm">Confirm</button>
                        <button onClick={() => declineRequest(req)} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-1.5 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* People you may know */}
          <div className="py-4">
            <p className="font-bold text-gray-900 mb-4">People you may know</p>
            <div className="space-y-5">
              {suggestions.map((user, i) => {
                const uid = user.id || user.name;
                const name = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.name;
                const isAdded = added[uid];
                const isFriend = friends.some(f => f.id === user.id);
                if (isFriend) return null;
                return (
                  <div key={uid + i} className="flex items-center gap-3">
                    <button onClick={() => user.id && !user.id.startsWith("s") && navigate(`/user/${user.id}`)} className={`w-14 h-14 rounded-full ${user.bg || "bg-blue-500"} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                        <span className="text-white text-xl font-bold">{name?.[0]}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{name}</p>
                      {(user.mutual || 0) > 0 && <p className="text-xs text-gray-400 mt-0.5">{user.mutual} mutual friends</p>}
                      <button
                        onClick={() => sendRequest(user)}
                        className={`mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isAdded ? "bg-gray-100 text-gray-500" : "bg-[#E7F3FF] text-[#1877F2]"}`}
                      >
                        {isAdded ? <><Check className="w-3.5 h-3.5" /> Request sent</> : <><UserPlus className="w-3.5 h-3.5" /> Add friend</>}
                      </button>
                    </div>
                    <button onClick={() => {}} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
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
                const name = f.firstName ? `${f.firstName} ${f.lastName || ""}`.trim() : f.name;
                return (
                  <div key={f.id} className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full ${f.bg || "bg-blue-500"} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                      {f.profilePicture ? <img src={f.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                        <span className="text-white text-xl font-bold">{name?.[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">Friends</p>
                    </div>
                    <button className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">Message</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}