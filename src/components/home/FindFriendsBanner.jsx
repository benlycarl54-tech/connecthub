import React from "react";
import { X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FindFriendsBanner({ onClose }) {
  return (
    <div className="bg-white border-b border-border px-4 py-4">
      <div className="flex justify-end mb-2">
        <button onClick={onClose}>
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      <div className="flex flex-col items-center text-center">
        <Users className="w-10 h-10 text-fb-blue mb-2" />
        <h3 className="text-base font-bold text-foreground mb-1">
          Want to see more posts from friends?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add more friends to see their posts in your Feed when they accept your friend request.
        </p>
        <div className="flex gap-3 w-full">
          <Button className="flex-1 h-10 rounded-lg bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-sm">
            Find friends
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 h-10 rounded-lg border-border text-foreground font-semibold text-sm">
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}