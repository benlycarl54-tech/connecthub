import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function MobileStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [useEmail, setUseEmail] = useState(false);
  const [mobile, setMobile] = useState(data.mobileNumber || "");
  const [email, setEmail] = useState(data.emailAddress || "");

  const handleNext = () => {
    if (useEmail && email.trim()) {
      update({ emailAddress: email.trim(), signupMethod: "email" });
      navigate("/register/password");
    } else if (!useEmail && mobile.trim()) {
      update({ mobileNumber: mobile.trim(), signupMethod: "phone" });
      navigate("/register/password");
    }
  };

  const isValid = useEmail ? email.trim().length > 0 : mobile.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/gender")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {useEmail ? "What's your email?" : "What's your mobile number?"}
      </h1>
      <p className="text-gray-500 text-base mb-6">
        {useEmail
          ? "Enter the email where you can be contacted. No one will see this on your profile."
          : "Enter the mobile number where you can be contacted. No one will see this on your profile."}
      </p>

      {useEmail ? (
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2] mb-4"
        />
      ) : (
        <>
          <input
            type="tel"
            placeholder="Mobile number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2] mb-2"
          />
          <p className="text-xs text-gray-500 mb-4">
            You may receive SMS notifications from us for security and login purposes.
          </p>
        </>
      )}

      <button
        onClick={handleNext}
        disabled={!isValid}
        className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base disabled:opacity-40 hover:bg-[#166FE5] transition-colors mb-3"
      >
        Next
      </button>

      <button
        onClick={() => setUseEmail(!useEmail)}
        className="w-full border border-gray-300 text-gray-800 font-semibold py-3.5 rounded-full text-base hover:bg-gray-50 transition-colors"
      >
        {useEmail ? "Sign up with mobile number instead" : "Sign up with email instead"}
      </button>

      <div className="flex-1" />
      <p className="text-center text-[#1877F2] font-semibold text-sm pb-4 cursor-pointer">
        Find my account
      </p>
    </div>
  );
}