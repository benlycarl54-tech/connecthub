import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

export default function PasswordStep() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [rememberInfo, setRememberInfo] = useState(true);

  const handleNext = () => {
    if (password.length >= 6) {
      localStorage.setItem("reg_password", "set");
      navigate("/register/terms");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/register/mobile")} className="mb-6">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Create a password</h1>
      <p className="text-base text-muted-foreground mb-6">
        Create a password with at least 6 letters or numbers. It should be something others can't guess.
      </p>

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-14 rounded-2xl border-border text-base mb-4"
      />

      <div className="flex items-center gap-3 mb-6">
        <Checkbox
          checked={rememberInfo}
          onCheckedChange={setRememberInfo}
          className="w-6 h-6 data-[state=checked]:bg-fb-blue data-[state=checked]:border-fb-blue rounded"
        />
        <span className="text-base text-foreground">
          Remember login info.{" "}
          <span className="text-fb-blue font-semibold">Learn more</span>
        </span>
      </div>

      <Button
        onClick={handleNext}
        disabled={password.length < 6}
        className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base disabled:opacity-50"
      >
        Next
      </Button>

      <div className="flex-1" />

      <p className="text-center text-fb-blue font-semibold text-sm cursor-pointer pb-4">
        Find my account
      </p>
    </div>
  );
}