import React, { useState } from "react";
import { Home, Users, MonitorPlay, Bell, Menu } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Users, label: "Friends" },
  { icon: MonitorPlay, label: "Watch" },
  { icon: Bell, label: "Notifications" },
  { icon: Menu, label: "Menu" },
];

export default function HomeNav() {
  const [active, setActive] = useState("Home");

  return (
    <div className="bg-white border-b border-border flex items-center justify-around px-2 sticky top-[52px] z-30">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setActive(item.label)}
          className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
            active === item.label
              ? "border-fb-blue text-fb-blue"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <item.icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}