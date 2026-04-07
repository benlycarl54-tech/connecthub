import React, { useState, useEffect } from "react";
import { Home, Users, MonitorPlay, Bell, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

export default function HomeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPendingRequestCount } = useFBAuth();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    getPendingRequestCount().then(setRequestCount).catch(() => {});
    // Poll every 30s for new requests
    const interval = setInterval(() => {
      getPendingRequestCount().then(setRequestCount).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "Friends", path: "/friends", badge: requestCount },
    { icon: MonitorPlay, label: "Watch", path: "/videos" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Menu, label: "Menu", path: null },
  ];

  const activePath = location.pathname;

  return (
    <div className="bg-white border-b border-border flex items-center justify-around px-2 sticky top-[52px] z-30">
      {navItems.map((item) => {
        const isActive = item.path && activePath === item.path;
        return (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`relative flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
              isActive ? "border-fb-blue text-fb-blue" : "border-transparent text-muted-foreground"
            }`}
          >
            <item.icon className="w-6 h-6" />
            {item.badge > 0 && (
              <span className="absolute top-1.5 right-1/4 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}