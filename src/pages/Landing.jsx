import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>English (US)</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <div className="mb-12">
          <svg viewBox="0 0 36 36" className="w-20 h-20" fill="#1877F2">
            <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z" />
            <path d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.095 1.116-4.095 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.526-.399Z" fill="white" />
          </svg>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-3">
          <Input
            placeholder="Mobile number or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl border-border bg-white text-base px-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl border-border bg-white text-base px-4"
          />
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base"
          >
            Log in
          </Button>
          <p className="text-center text-sm font-semibold text-foreground cursor-pointer">
            Forgot password?
          </p>
        </form>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate("/join")}
          className="w-full h-12 rounded-full border-fb-blue text-fb-blue font-semibold text-base hover:bg-accent"
        >
          Create new account
        </Button>
        <p className="text-center text-sm text-muted-foreground font-bold">Ⓜ Meta</p>
      </div>
    </div>
  );
}