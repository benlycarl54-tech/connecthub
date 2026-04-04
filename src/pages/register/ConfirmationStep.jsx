import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ConfirmationStep() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const contact = localStorage.getItem("reg_email") || localStorage.getItem("reg_mobile") || "your email/phone";

  const handleNext = () => {
    if (code.length === 5) {
      navigate("/register/picture");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/register/terms")} className="mb-6">
        <X className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Enter the confirmation code</h1>
      <p className="text-base text-muted-foreground mb-6">
        To confirm your account, enter the 5-digit code we sent to {contact}.
      </p>

      <Input
        placeholder="Confirmation code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
        className="h-14 rounded-2xl border-border text-base mb-4"
        inputMode="numeric"
      />

      <Button
        onClick={handleNext}
        disabled={code.length !== 5}
        className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base disabled:opacity-50 mb-3"
      >
        Next
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 rounded-full border-border text-foreground font-semibold text-base"
      >
        I didn't get the code
      </Button>
    </div>
  );
}