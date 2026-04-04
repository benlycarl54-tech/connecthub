import React from "react";
import { User } from "lucide-react";

const placeholderPosts = [
  {
    id: 1,
    author: "Welcome to Facebook",
    time: "Just now",
    content: "Start connecting with friends and family. Share your thoughts and see what's happening!",
  },
];

export default function FeedSection() {
  return (
    <div className="space-y-2 mt-2">
      {placeholderPosts.map((post) => (
        <div key={post.id} className="bg-white px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author}</p>
              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </div>
          <p className="text-sm text-foreground">{post.content}</p>
        </div>
      ))}

      {/* Loading placeholder */}
      <div className="bg-white px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}