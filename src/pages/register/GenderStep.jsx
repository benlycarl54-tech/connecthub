import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GenderStep() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const handleNext = () => {
    if (gender) {
      localStorage.setItem("reg_gender", gender);
      navigate("/register/mobile");
    }
  };

  const options = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "other", label: "More options", description: "Select More options to choose another gender or if you'd rather not say." },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4">
      <button onClick={() => navigate("/register/birthday")} className="mb-6">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">What's your gender?</h1>
      <p className="text-base text-muted-foreground mb-6">
        You can change who sees your gender on your profile later.
      </p>

      <div className="border border-border rounded-2xl overflow-hidden mb-4">
        {options.map((opt, i) => (
          <div
            key={opt.value}
            onClick={() => setGender(opt.value)}
            className={`flex items-center justify-between px-4 py-4 cursor-pointer ${
              i < options.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <p className="text-base font-medium text-foreground">{opt.label}</p>
              {opt.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
              )}
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                gender === opt.value ? "border-fb-blue" : "border-gray-300"
              }`}
            >
              {gender === opt.value && <div className="w-3 h-3 rounded-full bg-fb-blue" />}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!gender}
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