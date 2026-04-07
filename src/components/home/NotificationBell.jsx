import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";
import { loadNotificationsForUser, markAllRead } from "@/context/AuthContext";

const TYPE_ICON = {
  follow: "👤",
  like: "👍",
  love: "❤️",
  comment: "💬",
  friend_request: "🤝",
  welcome: "📘",
};

const WELCOME_NOTIF = {
  id: "welcome",
  type: "welcome",
  text: "Welcome to Facebook! Tap to find people you know.",
  time: "Just now",
  read: false,
  isFB: true,
};

export default function NotificationBell({ active }) {
  const navigate = useNavigate();
  const { currentUser } = useFBAuth();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const loadNotifs = () => {
    if (!currentUser?.id) return;
    const stored = loadNotificationsForUser(currentUser.id);
    const all = stored.length ? stored : [WELCOME_NOTIF];
    if (!all.find(n => n.id === "welcome")) all.push(WELCOME_NOTIF);
    setNotifs(all);
    setUnreadCount(all.filter(n => !n.read).length);
  };

  // Poll for new notifications every 5 seconds
  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 5000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && currentUser?.id) {
      markAllRead(currentUser.id);
      setUnreadCount(0);
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleNotifClick = (notif) => {
    setOpen(false);
    if (notif.type === "friend_request") navigate("/friends");
    else if (notif.type === "follow") navigate("/friends");
    else navigate("/notifications");
  };

  const recent = notifs.slice(0, 8);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className={`w-full flex items-center justify-center py-3 border-b-2 transition-colors relative ${
          active === "Notifications" || open
            ? "border-fb-blue text-fb-blue"
            : "border-transparent text-muted-foreground"
        }`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-[calc(50%-18px)] min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Notifications</h3>
            <button
              onClick={() => { setOpen(false); navigate("/notifications"); }}
              className="text-xs font-semibold text-[#1877F2] hover:underline"
            >
              See all
            </button>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-3xl mb-2">🔔</p>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              recent.map((n, i) => (
                <DropdownNotifItem key={n.id || i} notif={n} onClick={() => handleNotifClick(n)} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownNotifItem({ notif, onClick }) {
  const icon = TYPE_ICON[notif.type] || "🔔";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? "bg-[#EBF5FF] hover:bg-[#ddeeff]" : ""}`}
    >
      <div className="relative flex-shrink-0">
        {notif.isFB ? (
          <div className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center">
            <span className="text-white font-bold text-2xl leading-none" style={{ fontFamily: "Georgia, serif" }}>f</span>
          </div>
        ) : notif.avatar ? (
          <img src={notif.avatar} className="w-11 h-11 rounded-full object-cover" alt="" />
        ) : (
          <div className={`w-11 h-11 rounded-full ${notif.avatarColor || "bg-[#1877F2]"} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{notif.avatarInitial || "?"}</span>
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center border-2 border-white text-[10px]">
          {icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 leading-snug line-clamp-2">
          {notif.actorName && <span className="font-bold">{notif.actorName} </span>}
          <span>{notif.actorName ? notif.text.replace(notif.actorName + " ", "") : notif.text}</span>
        </p>
        <p className={`text-xs mt-0.5 font-semibold ${!notif.read ? "text-[#1877F2]" : "text-gray-400"}`}>{notif.time || "Just now"}</p>
      </div>

      {!notif.read && <div className="w-2.5 h-2.5 bg-[#1877F2] rounded-full flex-shrink-0" />}
    </div>
  );
}