import React from "react";
import { Plus, User, X } from "lucide-react";

export default function StorySection() {
  return (
    <div className="bg-white border-b border-border p-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* Create story card */}
        <div className="flex-shrink-0 w-28 relative">
          <div className="w-28 h-40 bg-gray-200 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white pt-5 pb-2 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-fb-blue flex items-center justify-center border-4 border-white -mt-8 relative z-10">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-foreground mt-1">Create story</span>
            </div>
          </div>
        </div>

        {/* Friend suggestion overlay */}
        <div className="flex-shrink-0 w-44 bg-blue-50 rounded-xl p-3 relative">
          <button className="absolute top-2 right-2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center">
              <MonitorPlay className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-xs font-semibold text-foreground mb-1">Facebook is better with friends</p>
          <p className="text-xs text-muted-foreground mb-2">
            See stories from friends by adding people you know from your contacts.
          </p>
          <button className="text-fb-blue text-sm font-semibold">Find friends</button>
        </div>
      </div>
    </div>
  );
}

function MonitorPlay(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <polygon points="10 9 15 12 10 15" />
    </svg>
  );
}