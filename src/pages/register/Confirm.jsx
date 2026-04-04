import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Confirm() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const [code, setCode] = useState("");

  // Simulate a code - in real app this would be sent via SMS/email
  const DEMO_CODE = "12345";

  const handleNext = () => {
    if (code === DEMO_CODE) {
      navigate("/register/photo");
    } else {
      alert(`Invalid code. For demo purposes, use: ${DEMO_CODE}`);
    }
  };

  const contact = data.email || data.mobile || "your contact";

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/register/terms")} className="mb-4">
        <X className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter the confirmation code</h1>
      <p className="text-gray-500 text-base mb-8">
        To confirm your account, enter the 5-digit code we sent to{" "}
        <strong>{contact}</strong>.
        {" "}<span className="text-xs text-gray-400">(Demo code: 12345)</span>
      </p>

      <input
        type="text"
        placeholder="Confirmation code"
        value={code}
        onChange={e => setCode(e.target.value)}
        maxLength={5}
        className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50 mb-6 tracking-widest text-center text-xl"
        autoFocus
      />

      <button
        onClick={handleNext}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors mb-3"
      >
        Next
      </button>
      <button className="w-full bg-gray-100 text-gray-800 font-semibold py-4 rounded-full text-base hover:bg-gray-200 transition-colors">
        I didn't get the code
      </button>
    </div>
  );
}