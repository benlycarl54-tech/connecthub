import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function NameStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");

  const handleNext = () => {
    if (firstName.trim() && lastName.trim()) {
      update({ firstName: firstName.trim(), lastName: lastName.trim() });
      navigate("/register/birthday");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/join")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">What's your name?</h1>
      <p className="text-gray-500 text-base mb-6">Enter the name you use in real life.</p>

      <div className="flex gap-3 mb-4">
        <input
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2]"
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2]"
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!firstName.trim() || !lastName.trim()}
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