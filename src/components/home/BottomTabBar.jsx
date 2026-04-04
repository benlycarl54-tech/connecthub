import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, PlaySquare, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

function getNotifCount() {
  try { return JSON.parse(localStorage.getItem("fb_notifications") || "[]").filter(n => !n.read).length; } catch { return 0; }
}

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(getNotifCount);

  useEffect(() => {
    const interval = setInterval(() => setNotifCount(getNotifCount()), 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { Icon: Home, path: "/home", label: "Home" },
    { Icon: Users, path: "/friends", label: "Friends" },
    { Icon: PlaySquare, path: "/videos", label: "Videos" },
    { Icon: Bell, path: "/notifications", label: "Notifications" },
    { Icon: User, path: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex z-50 shadow-lg">
      {tabs.map(({ Icon, path, label }, i) => {
        const active = location.pathname === path;
        return (
          <button
            key={i}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 relative transition-colors ${active ? "text-[#1877F2]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {i === 3 && notifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </div>
            {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1877F2] rounded-t-full" />}
          </button>
        );
      })}
    </div>
  );
}