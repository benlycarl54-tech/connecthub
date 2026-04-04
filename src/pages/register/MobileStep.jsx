import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function MobileStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [mobile, setMobile] = useState(data.mobileNumber || "");
  const [email, setEmail] = useState(data.emailAddress || "");

  const handleNext = () => {
    if (email.trim() && mobile.trim()) {
      update({ 
        emailAddress: email.trim(), 
        mobileNumber: mobile.trim(),
        signupMethod: "both" 
      });
      navigate("/register/password");
    }
  };

  const isValid = email.trim().length > 0 && mobile.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/gender")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Information</h1>
      <p className="text-gray-500 text-base mb-6">Enter both your email and mobile number to create your account. You'll use either one to log in.</p>

      <div className="space-y-3 mb-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2]"
        />
        <input
          type="tel"
          placeholder="Mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2]"
        />
        <p className="text-xs text-gray-500">
          You may receive SMS notifications from us for security and login purposes.
        </p>
      </div>

      <button
        onClick={handleNext}
        disabled={!isValid}
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