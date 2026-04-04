import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function GenderStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [gender, setGender] = useState(data.gender || "");

  const handleNext = () => {
    if (gender) {
      update({ gender });
      navigate("/register/mobile");
    }
  };

  const options = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "other", label: "More options" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/birthday")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">What's your gender?</h1>
      <p className="text-gray-500 text-base mb-6">
        You can change who sees your gender on your profile later.
      </p>

      <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
        {options.map((opt, i) => (
          <div
            key={opt.value}
            onClick={() => setGender(opt.value)}
            className={`flex items-center justify-between px-4 py-4 cursor-pointer ${
              i < options.length - 1 ? "border-b border-gray-200" : ""
            } ${gender === opt.value ? "bg-blue-50" : ""}`}
          >
            <span className="text-base text-gray-900">{opt.label}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              gender === opt.value ? "border-[#1877F2]" : "border-gray-300"
            }`}>
              {gender === opt.value && <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2]" />}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!gender}
        className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base disabled:opacity-40 hover:bg-[#166FE5] transition-colors"
      >
        Next
      </button>

      <div className="flex-1" />
      <p className="text-center text-[#1877F2] font-semibold text-sm pb-4 cursor-pointer">
        Find my account
      </p>
    </div>
  );
}