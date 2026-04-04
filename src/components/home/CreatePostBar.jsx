import React from "react";
import { User, Image } from "lucide-react";

export default function CreatePostBar() {
  return (
    <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-border">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1 h-10 rounded-full border border-border px-4 flex items-center">
        <span className="text-sm text-muted-foreground">What's on your mind?</span>
      </div>
      <button className="flex-shrink-0">
        <Image className="w-6 h-6 text-green-500" />
      </button>
    </div>
  );
}