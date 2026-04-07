import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

export default function NewChatModal({ onSelect, onClose }) {
  const { getAllUsers, currentUser } = useFBAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(all => setUsers(all.filter(u => u.id !== currentUser?.id)));
  }, []);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    (u.emailAddress || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-t-3xl pb-6 max-h-[75vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">New Message</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              autoFocus
              placeholder="Search people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No users found</p>
          )}
          {filtered.slice(0, 30).map(u => (
            <button
              key={u.id}
              onClick={() => onSelect(u)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                {u.profilePicture ? (
                  <img src={u.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white font-bold">{u.firstName?.[0] || "?"}</span>
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                {u.emailAddress && <p className="text-xs text-gray-400">{u.emailAddress}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}