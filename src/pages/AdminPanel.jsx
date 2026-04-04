import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Shield, Check, X, Edit3, Save } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";

function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    followers: user.followers || 0,
    following: user.following || 0,
    likes: user.likes || 0,
    is_verified: user.is_verified || false,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Edit {user.firstName} {user.lastName}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-300">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white text-xl font-bold">{user.firstName?.[0]}</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">{user.emailAddress ? user.emailAddress.replace(/(.{2}).*(@.*)/, "$1***$2") : user.mobileNumber ? "****" + user.mobileNumber.slice(-4) : ""}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Followers</label>
            <input
              type="number"
              value={form.followers}
              onChange={e => setForm({...form, followers: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Following</label>
            <input
              type="number"
              value={form.following}
              onChange={e => setForm({...form, following: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Likes</label>
            <input
              type="number"
              value={form.likes}
              onChange={e => setForm({...form, likes: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]"
            />
          </div>

          {/* Verified badge toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <VerifiedBadge size={24} />
              <div>
                <p className="font-semibold text-sm text-gray-900">Verified Badge</p>
                <p className="text-xs text-gray-500">Show blue checkmark on profile</p>
              </div>
            </div>
            <button
              onClick={() => setForm({...form, is_verified: !form.is_verified})}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.is_verified ? "bg-[#1877F2]" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.is_verified ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 text-sm">Cancel</button>
          <button
            onClick={() => { onSave(user.id, form); onClose(); }}
            className="flex-1 py-2.5 bg-[#1877F2] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser, getAllUsers, adminUpdateUser } = useFBAuth();
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [saved, setSaved] = useState(false);

  // Only admins can access
  if (!currentUser?.is_admin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center max-w-md mx-auto px-6">
        <Shield className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-center text-sm mb-6">You must be an admin to view this page.</p>
        <button onClick={() => navigate("/home")} className="text-[#1877F2] font-semibold">Go home</button>
      </div>
    );
  }

  const allUsers = getAllUsers();
  const filtered = search.trim()
    ? allUsers.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()))
    : allUsers;

  const handleSave = (userId, updates) => {
    adminUpdateUser(userId, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1877F2]" />
            <h1 className="font-bold text-lg text-gray-900">Admin Panel</h1>
          </div>
          {saved && <span className="ml-auto text-xs text-green-600 font-semibold">✓ Saved!</span>}
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">PLATFORM STATS</p>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{allUsers.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1877F2]">{allUsers.filter(u => u.is_verified).length}</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{allUsers.filter(u => u.is_admin).length}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="mx-3 mt-3 space-y-2 pb-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        ) : (
          filtered.map(user => (
            <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user.firstName?.[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user.firstName} {user.lastName}</p>
                    {user.is_verified && <VerifiedBadge size={16} />}
                    {user.is_admin && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.emailAddress ? user.emailAddress.replace(/(.{2}).*(@.*)/, "$1***$2") : user.mobileNumber ? user.mobileNumber.replace(/.(?=.{4})/g, "*") : "No contact"}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-500">👥 {user.followers || 0}</span>
                    <span className="text-xs text-gray-500">➡️ {user.following || 0}</span>
                    <span className="text-xs text-gray-500">❤️ {user.likes || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingUser(user)}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 flex-shrink-0"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}