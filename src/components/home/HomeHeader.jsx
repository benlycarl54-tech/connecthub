import React from "react";
import { Plus, Search, MessageCircle } from "lucide-react";

export default function HomeHeader() {
  return (
    <div className="bg-white px-4 py-2 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-fb-blue text-2xl font-bold tracking-tight" style={{ fontFamily: "serif" }}>
        facebook
      </h1>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-fb-gray flex items-center justify-center">
          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-full bg-fb-gray flex items-center justify-center">
          <Search className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-10 h-10 rounded-full bg-fb-gray flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}