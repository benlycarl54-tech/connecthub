import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Shield, X, Edit3, Save, Ban, CheckCircle, LogIn, Eye, EyeOff } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";

function EditUserModal({ user, onClose, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    emailAddress: user.emailAddress || "",
    mobileNumber: user.mobileNumber || "",
    password: user.password || "",
    followers: user.followers || 0,
    following: user.following || 0,
    likes: user.likes || 0,
    is_verified: user.is_verified || false,
    is_banned: user.is_banned || false,
    is_admin: user.is_admin || false,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">First Name</label>
              <input type="text" value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Last Name</label>
              <input type="text" value={form.lastName}
                onChange={e => setForm({...form, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <input type="text" value={form.emailAddress}
              onChange={e => setForm({...form, emailAddress: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile Number</label>
            <input type="text" value={form.mobileNumber}
              onChange={e => setForm({...form, mobileNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2] pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Followers</label>
            <input type="number" value={form.followers}
              onChange={e => setForm({...form, followers: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Following</label>
            <input type="number" value={form.following}
              onChange={e => setForm({...form, following: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Total Likes</label>
            <input type="number" value={form.likes}
              onChange={e => setForm({...form, likes: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1877F2]" />
          </div>

          {/* Verified badge toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <VerifiedBadge size={22} />
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

          {/* Admin toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Admin Access</p>
                <p className="text-xs text-gray-500">Grant admin privileges</p>
              </div>
            </div>
            <button
              onClick={() => setForm({...form, is_admin: !form.is_admin})}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.is_admin ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.is_admin ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {/* Ban user toggle */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Ban className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Ban Account</p>
                <p className="text-xs text-gray-500">Block user from logging in</p>
              </div>
            </div>
            <button
              onClick={() => setForm({...form, is_banned: !form.is_banned})}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.is_banned ? "bg-red-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.is_banned ? "left-6" : "left-0.5"}`} />
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
  const { currentUser, getAllUsers, adminUpdateUser, login } = useFBAuth();
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginAsError, setLoginAsError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users.filter(u => !u.id.startsWith("feed_")));
    } catch (error) {
      console.error("Load users error:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filtered = allUsers.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      (u.emailAddress || "").toLowerCase().includes(q) ||
      (u.mobileNumber || "").includes(q)
    );
  });

  const handleLoginAs = async (user) => {
    if (!user.emailAddress && !user.mobileNumber) {
      setLoginAsError("This user has no email or phone to log in with.");
      setTimeout(() => setLoginAsError(""), 3000);
      return;
    }
    if (!user.password) {
      setLoginAsError("This user has no password set.");
      setTimeout(() => setLoginAsError(""), 3000);
      return;
    }
    const identifier = user.emailAddress || user.mobileNumber;
    const result = await login(identifier, user.password);
    if (result.success) {
      navigate("/home");
    } else {
      setLoginAsError(result.error);
      setTimeout(() => setLoginAsError(""), 3000);
    }
  };

  const handleSave = async (userId, updates) => {
    await adminUpdateUser(userId, updates);
    await loadUsers();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const quickToggle = async (user, field) => {
    await adminUpdateUser(user.id, { [field]: !user[field] });
    await loadUsers();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto">
      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSave} />
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
          {saved && <span className="ml-auto text-xs text-green-600 font-semibold animate-pulse">✓ Saved!</span>}
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
            />
            {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Platform Stats</p>
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
            <p className="text-xl font-bold text-red-500">{allUsers.filter(u => u.is_banned).length}</p>
            <p className="text-xs text-gray-500">Banned</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{allUsers.filter(u => u.is_admin).length}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
        </div>
      </div>

      {/* Login as error */}
      {loginAsError && (
        <div className="mx-3 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 text-center">
          {loginAsError}
        </div>
      )}

      {/* User list */}
      <div className="mx-3 mt-3 space-y-2 pb-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        ) : (
          filtered.map(user => (
            <div key={user.id} className={`bg-white rounded-xl p-4 shadow-sm ${user.is_banned ? "border border-red-200" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 relative">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="" className={`w-full h-full object-cover ${user.is_banned ? "opacity-50 grayscale" : ""}`} />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${user.is_banned ? "bg-gray-400" : "bg-[#1877F2]"}`}>
                      <span className="text-white font-bold text-lg">{user.firstName?.[0]}</span>
                    </div>
                  )}
                  {user.is_banned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                      <Ban className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                    {user.is_verified && <VerifiedBadge size={16} />}
                    {user.is_admin && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                    {user.is_banned && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">BANNED</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.emailAddress || user.mobileNumber || "No contact"}
                  </p>
                  {user.password && (
                    <p className="text-xs text-gray-400">🔑 {user.password}</p>
                  )}
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-500">👥 {user.followers || 0}</span>
                    <span className="text-xs text-gray-500">➡️ {user.following || 0}</span>
                    <span className="text-xs text-gray-500">❤️ {user.likes || 0}</span>
                  </div>
                </div>
                {/* Quick actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleLoginAs(user)}
                    className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200"
                    title="Login as this user"
                  >
                    <LogIn className="w-3.5 h-3.5 text-green-600" />
                  </button>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                    title="Edit user"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => quickToggle(user, "is_verified")}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${user.is_verified ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-100 hover:bg-gray-200"}`}
                    title={user.is_verified ? "Remove verified" : "Verify user"}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${user.is_verified ? "text-[#1877F2]" : "text-gray-400"}`} />
                  </button>
                  <button
                    onClick={() => quickToggle(user, "is_banned")}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${user.is_banned ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200"}`}
                    title={user.is_banned ? "Unban user" : "Ban user"}
                  >
                    <Ban className={`w-3.5 h-3.5 ${user.is_banned ? "text-red-500" : "text-gray-400"}`} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}