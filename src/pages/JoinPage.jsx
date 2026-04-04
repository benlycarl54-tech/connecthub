import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function JoinPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-4">Join Facebook</h1>

      {/* Illustration */}
      <div className="w-full rounded-2xl bg-pink-100 p-6 mb-4 flex items-center justify-center min-h-[180px]">
        <div className="flex items-end gap-3">
          <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <div className="w-20 h-24 bg-yellow-400 rounded-lg border-4 border-yellow-500 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-5 h-8 bg-gray-600 rounded-full" />
              <div className="w-5 h-8 bg-gray-700 rounded-full" />
              <div className="w-5 h-8 bg-gray-500 rounded-full" />
            </div>
          </div>
          <div className="w-14 h-14 text-fb-blue">
            <svg viewBox="0 0 24 24" className="w-14 h-14 fill-fb-blue"><path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/></svg>
          </div>
        </div>
      </div>

      <p className="text-base text-foreground mb-6">
        Create an account to connect with friends, family and communities of people who share your interests.
      </p>

      <Button
        onClick={() => navigate("/signup/name")}
        className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base mb-3"
      >
        Create new account
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 rounded-full border-border text-foreground font-semibold text-base"
      >
        Find my account
      </Button>
    </div>
  );
}