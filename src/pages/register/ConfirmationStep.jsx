import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function ConfirmationStep() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const [code, setCode] = useState("");

  const contact = data.emailAddress || data.mobileNumber || "your contact";

  const handleNext = () => {
    // Accept any 5-digit code for demo
    if (code.length >= 5) {
      navigate("/register/picture");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/terms")} className="mb-6 self-start">
        <X className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Enter confirmation code
      </h1>
      <p className="text-gray-500 text-base mb-6">
        To confirm your account, enter the 5-digit code we sent to{" "}
        <span className="font-semibold text-gray-800">{contact}</span>.{" "}
        <span className="text-[#1877F2] cursor-pointer">Why did I receive this?</span>
      </p>

      <input
        placeholder="- - - - -"
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-2xl text-center tracking-[0.5em] outline-none focus:border-[#1877F2] mb-2"
        inputMode="numeric"
      />

      <p className="text-xs text-gray-400 text-center mb-4">
        (For demo, enter any 5 digits)
      </p>

      <button
        onClick={handleNext}
        disabled={code.length < 5}
        className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base disabled:opacity-40 hover:bg-[#166FE5] transition-colors mb-3"
      >
        Next
      </button>

      <button className="w-full border border-gray-300 text-gray-800 font-semibold py-3.5 rounded-full text-base hover:bg-gray-50 transition-colors">
        I didn't get the code
      </button>
    </div>
  );
}