import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";

export default function FriendsStep() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-border">
        <button onClick={() => navigate("/register/welcome")}>
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground flex-1 text-center mr-6">Add your friends</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-12">
        <div className="w-32 h-32 bg-blue-300 rounded-2xl flex flex-col items-center justify-center mb-6">
          <Users className="w-12 h-12 text-white mb-1" />
          <div className="w-16 h-1.5 bg-gray-800 rounded-full mb-1" />
          <div className="w-12 h-1.5 bg-gray-800 rounded-full" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">No friend suggestions yet</h2>
        <p className="text-base text-muted-foreground text-center max-w-sm">
          Try searching for people you want to add. You can also import your contacts to get better friend suggestions.
        </p>
      </div>

      <div className="px-5 pb-6">
        <Button
          onClick={() => navigate("/home")}
          className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base"
        >
          Next
        </Button>
      </div>
    </div>
  );
}