import React, { useState, useEffect } from "react";
import { Home, Users, MonitorPlay, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

export default function HomeNav({ active, setActive }) {
  const navigate = useNavigate();
  const { getPendingRequestCount } = useFBAuth();
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  useEffect(() => {
    getPendingRequestCount().then(setFriendRequestCount).catch(() => {});
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "Friends", path: "/friends", badge: friendRequestCount },
    { icon: MonitorPlay, label: "Watch", path: "/videos" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Menu, label: "Menu", path: null },
  ];

  return (
    <div className="bg-white border-b border-border flex items-center justify-around px-2 sticky top-[52px] z-30">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if (item.path) navigate(item.path);
            if (setActive) setActive(item.label);
          }}
          className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors relative ${
            active === item.label
              ? "border-fb-blue text-fb-blue"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <item.icon className="w-6 h-6" />
          {item.badge > 0 && (
            <span className="absolute top-1.5 right-[calc(50%-18px)] w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}