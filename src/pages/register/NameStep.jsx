import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NameStep() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleNext = () => {
    if (firstName.trim() && lastName.trim()) {
      localStorage.setItem("reg_first_name", firstName);
      localStorage.setItem("reg_last_name", lastName);
      navigate("/register/birthday");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/join")} className="mb-6">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">What's your name?</h1>
      <p className="text-base text-muted-foreground mb-6">Enter the name you use in real life.</p>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-14 rounded-2xl border-border text-base flex-1"
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="h-14 rounded-2xl border-border text-base flex-1"
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!firstName.trim() || !lastName.trim()}
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