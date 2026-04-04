import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "../context/AuthContext";

function getNotifications() {
  try { return JSON.parse(localStorage.getItem("fb_notifications") || "[]"); } catch { return []; }
}

const DEFAULT_NOTIFS = [
  {
    id: 1,
    type: "welcome",
    text: "Welcome to Facebook! Tap here to find people you know and add them as friends.",
    time: "14h",
    read: false,
    isFB: true,
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useFBAuth();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const stored = getNotifications();
    setNotifs([...stored, ...DEFAULT_NOTIFS]);
    // Mark all as read
    const updated = stored.map(n => ({ ...n, read: true }));
    localStorage.setItem("fb_notifications", JSON.stringify(updated));
  }, []);

  const unread = notifs.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-800">☰</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="border-t border-gray-100" />

      <div className="px-4 pt-3">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🔔</span>
            </div>
            <p className="font-bold text-gray-900">No notifications yet</p>
          </div>
        ) : (
          <>
            {unread.length > 0 && <p className="font-bold text-gray-900 mb-3">New</p>}
            <div className="space-y-1">
              {notifs.map((n, i) => (
                <div
                  key={n.id || i}
                  className={`flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer hover:bg-gray-50 ${!n.read ? "bg-blue-50" : ""}`}
                  onClick={() => navigate("/friends")}
                >
                  {/* Icon/Avatar */}
                  <div className="relative flex-shrink-0">
                    {n.isFB ? (
                      <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center">
                        <span className="text-white font-bold text-2xl" style={{ fontFamily: "Georgia, serif" }}>f</span>
                      </div>
                    ) : n.avatar ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={n.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 rounded-full ${n.bg || "bg-[#1877F2]"} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">{n.text?.[0] || "F"}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-xs">🔔</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug line-clamp-3">{n.text}</p>
                    <p className={`text-xs mt-1 font-semibold ${!n.read ? "text-[#1877F2]" : "text-gray-400"}`}>{n.time}</p>
                  </div>

                  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 flex-shrink-0">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}