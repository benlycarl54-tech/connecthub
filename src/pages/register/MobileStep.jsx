import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MobileStep() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [email, setEmail] = useState("");

  const handleNext = () => {
    if (useEmail) {
      if (email.trim()) {
        localStorage.setItem("reg_email", email);
        localStorage.setItem("reg_method", "email");
        navigate("/register/password");
      }
    } else {
      if (mobile.trim()) {
        localStorage.setItem("reg_mobile", mobile);
        localStorage.setItem("reg_method", "phone");
        navigate("/register/password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/register/gender")} className="mb-6">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">
        {useEmail ? "What's your email?" : "What's your mobile number?"}
      </h1>
      <p className="text-base text-muted-foreground mb-6">
        {useEmail
          ? "Enter the email where you can be contacted. No one will see this on your profile."
          : "Enter the mobile number where you can be contacted. No one will see this on your profile."}
      </p>

      {useEmail ? (
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 rounded-2xl border-border text-base mb-2"
        />
      ) : (
        <>
          <Input
            type="tel"
            placeholder="Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="h-14 rounded-2xl border-border text-base mb-2"
          />
          <p className="text-sm text-muted-foreground mb-4">
            You may receive WhatsApp and SMS notifications from us.{" "}
            <span className="text-fb-blue font-semibold">Learn more</span>
          </p>
        </>
      )}

      <Button
        onClick={handleNext}
        disabled={useEmail ? !email.trim() : !mobile.trim()}
        className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base disabled:opacity-50 mb-3"
      >
        Next
      </Button>

      <Button
        variant="outline"
        onClick={() => setUseEmail(!useEmail)}
        className="w-full h-12 rounded-full border-border text-foreground font-semibold text-base"
      >
        {useEmail ? "Sign up with phone number" : "Sign up with email"}
      </Button>

      <div className="flex-1" />

      <p className="text-center text-fb-blue font-semibold text-sm cursor-pointer pb-4">
        Find my account
      </p>
    </div>
  );
}