import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import BirthdayPicker from "@/components/signup/BirthdayPicker";

export default function BirthdayStep() {
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const age = birthday ? differenceInYears(new Date(), birthday) : null;

  const handleNext = () => {
    if (birthday) {
      localStorage.setItem("reg_birthday", birthday.toISOString());
      navigate("/register/gender");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/register/name")} className="mb-6">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">What's your birthday?</h1>
      <p className="text-base text-muted-foreground mb-1">
        Choose your date of birth. You can always make this private later.{" "}
        <span className="text-fb-blue font-semibold cursor-pointer">
          Why do I need to provide my birthday?
        </span>
      </p>

      <div
        onClick={() => setShowPicker(true)}
        className="mt-4 h-16 rounded-2xl border border-border px-4 flex flex-col justify-center cursor-pointer"
      >
        <span className="text-xs text-muted-foreground">
          Birthday {age !== null ? `(${age} years old)` : ""}
        </span>
        <span className="text-base text-foreground">
          {birthday ? format(birthday, "MMMM d, yyyy") : "Select date"}
        </span>
      </div>

      <Button
        onClick={handleNext}
        disabled={!birthday}
        className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base mt-4 disabled:opacity-50"
      >
        Next
      </Button>

      <div className="flex-1" />

      <p className="text-center text-fb-blue font-semibold text-sm cursor-pointer pb-4">
        Find my account
      </p>

      {showPicker && (
        <BirthdayPicker
          value={birthday}
          onSet={(date) => {
            setBirthday(date);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}