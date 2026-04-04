import { useState } from "react";
import { Search, UserPlus, Check, X } from "lucide-react";
import { useFBAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SUGGESTED = [
  { id: "s1", name: "Amara Johnson", mutual: 3, avatar: null, bg: "bg-pink-400" },
  { id: "s2", name: "Kofi Mensah", mutual: 5, avatar: null, bg: "bg-blue-500" },
  { id: "s3", name: "Fatima Al-Hassan", mutual: 2, avatar: null, bg: "bg-teal-500" },
  { id: "s4", name: "David Osei", mutual: 7, avatar: null, bg: "bg-orange-400" },
  { id: "s5", name: "Ngozi Williams", mutual: 1, avatar: null, bg: "bg-purple-500" },
  { id: "s6", name: "Emmanuel Darko", mutual: 4, avatar: null, bg: "bg-green-500" },
  { id: "s7", name: "Ama Boateng", mutual: 6, avatar: null, bg: "bg-red-400" },
  { id: "s8", name: "Kwame Asante", mutual: 2, avatar: null, bg: "bg-yellow-500" },
];

function getRequests() {
  try { return JSON.parse(localStorage.getItem("fb_friend_requests") || "[]"); } catch { return []; }
}
function saveRequests(r) { localStorage.setItem("fb_friend_requests", JSON.stringify(r)); }
function getFriends() {
  try { return JSON.parse(localStorage.getItem("fb_friends") || "[]"); } catch { return []; }
}
function saveFriends(f) { localStorage.setItem("fb_friends", JSON.stringify(f)); }

export default function FriendsPage() {
  const navigate = useNavigate();
  const { getAllUsers, currentUser } = useFBAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [added, setAdded] = useState({});
  const [requests, setRequests] = useState(getRequests);
  const [friends, setFriends] = useState(getFriends);

  const allUsers = getAllUsers().filter(u => u.id !== currentUser?.id);

  const sendRequest = (user) => {
    const newReqs = [...requests, { ...user, fromId: currentUser?.id, time: new Date().toISOString() }];
    setRequests(newReqs);
    saveRequests(newReqs);
    setAdded(prev => ({ ...prev, [user.id]: true }));
    // Add a notification for the target user
    const notifs = JSON.parse(localStorage.getItem("fb_notifications") || "[]");
    notifs.unshift({
      id: Date.now(),
      type: "friend_request",
      text: `${currentUser?.firstName || "Someone"} ${currentUser?.lastName || ""} sent you a friend request.`,
      time: "Just now",
      read: false,
      avatar: currentUser?.profilePicture || null,
      bg: "bg-[#1877F2]",
    });
    localStorage.setItem("fb_notifications", JSON.stringify(notifs));
  };

  const acceptRequest = (req) => {
    const newFriends = [...friends, req];
    saveFriends(newFriends);
    setFriends(newFriends);
    const newReqs = requests.filter(r => r.id !== req.id);
    saveRequests(newReqs);
    setRequests(newReqs);
  };

  const declineRequest = (req) => {
    const newReqs = requests.filter(r => r.id !== req.id);
    saveRequests(newReqs);
    setRequests(newReqs);
  };

  const incomingRequests = requests.filter(r => r.fromId !== currentUser?.id);

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
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
      <div className="flex gap-2 px-4 pb-3">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${activeTab === "requests" ? "bg-blue-100 text-[#1877F2] border-blue-100" : "bg-gray-100 text-gray-700 border-gray-100"}`}
        >
          Friend requests
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${activeTab === "friends" ? "bg-blue-100 text-[#1877F2] border-blue-100" : "bg-gray-100 text-gray-700 border-gray-100"}`}
        >
          Your friends
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {activeTab === "requests" && (
        <div className="px-4">
          {incomingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-28 h-28 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full" />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-2">No new requests</p>
              <p className="text-sm text-gray-500 text-center mb-5 px-4">Try uploading your phone contacts so you can find your friends on Facebook.</p>
              <button className="px-6 py-2 bg-blue-50 text-[#1877F2] font-semibold rounded-full text-sm border border-blue-100">Upload contacts</button>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="font-bold text-gray-900">Friend requests ({incomingRequests.length})</p>
              {incomingRequests.map(req => (
                <div key={req.id} className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full ${req.bg || "bg-blue-500"} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {req.profilePicture ? <img src={req.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                      <span className="text-white text-2xl font-bold">{req.firstName?.[0] || req.name?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{req.firstName} {req.lastName || req.name}</p>
                    <p className="text-xs text-gray-500">{req.time || "Recently"}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => acceptRequest(req)} className="flex-1 bg-[#1877F2] text-white font-semibold py-1.5 rounded-lg text-sm">Confirm</button>
                      <button onClick={() => declineRequest(req)} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-1.5 rounded-lg text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* People you may know */}
          <div className="py-4">
            <p className="font-bold text-gray-900 mb-3">People you may know</p>
            <div className="space-y-4">
              {[...allUsers.slice(0, 4), ...SUGGESTED].map((user, i) => {
                const uid = user.id || user.name;
                const name = user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.name;
                return (
                  <div key={uid + i} className="flex items-center gap-3">
                    <button onClick={() => user.id && navigate(`/user/${user.id}`)} className={`w-16 h-16 rounded-full ${user.bg || "bg-blue-500"} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                        <span className="text-white text-2xl font-bold">{name?.[0]}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      {(user.mutual || 0) > 0 && <p className="text-xs text-gray-500">{user.mutual} mutual friends</p>}
                      <button
                        onClick={() => sendRequest(user)}
                        className={`mt-1.5 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold ${added[uid] ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-[#1877F2]"}`}
                      >
                        {added[uid] ? <><Check className="w-4 h-4" /> Request sent</> : <><UserPlus className="w-4 h-4" /> Add friend</>}
                      </button>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
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
              <p className="text-sm text-gray-500 text-center mt-1">Accept friend requests to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {friends.map((f, i) => {
                const name = f.firstName ? `${f.firstName} ${f.lastName || ""}` : f.name;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full ${f.bg || "bg-blue-500"} flex items-center justify-center overflow-hidden`}>
                      {f.profilePicture ? <img src={f.profilePicture} className="w-full h-full object-cover" alt="" /> : (
                        <span className="text-white text-xl font-bold">{name?.[0]}</span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900">{name}</p>
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