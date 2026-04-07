import React from "react";
import { Plus, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalSearchBar from "./GlobalSearchBar";

export default function HomeHeader() {
  const navigate = useNavigate();
  return (
    <div className="bg-white px-3 py-2 flex items-center gap-2 sticky top-0 z-30">
      <h1 className="text-fb-blue text-2xl font-bold tracking-tight flex-shrink-0" style={{ fontFamily: "serif" }}>
        facebook
      </h1>
      <GlobalSearchBar />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button className="w-9 h-9 rounded-full bg-fb-gray flex items-center justify-center">
          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={() => navigate("/messages")} className="w-9 h-9 rounded-full bg-fb-gray flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}