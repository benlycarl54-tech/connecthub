import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Gender() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [gender, setGender] = useState(data.gender || "");

  const handleNext = () => {
    if (!gender) return alert("Please select your gender.");
    update({ gender });
    navigate("/register/mobile");
  };

  const options = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "more", label: "More options", sub: "Select More options to choose another gender or if you'd rather not say." },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/register/birthday")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your gender?</h1>
      <p className="text-gray-500 text-base mb-6">You can change who sees your gender on your profile later.</p>

      <div className="border border-gray-300 rounded-2xl overflow-hidden mb-6">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => setGender(opt.value)}
            className={`w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors ${i < options.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div>
              <p className="font-medium text-gray-900">{opt.label}</p>
              {opt.sub && <p className="text-sm text-gray-500 mt-0.5">{opt.sub}</p>}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${gender === opt.value ? "border-[#1877F2]" : "border-gray-400"}`}>
              {gender === opt.value && <div className="w-3 h-3 rounded-full bg-[#1877F2]" />}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors"
      >
        Next
      </button>

      <div className="flex-1" />
      <button className="text-[#1877F2] font-semibold text-base text-center mt-8">Find my account</button>
    </div>
  );
}