import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Mobile() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [mobile, setMobile] = useState(data.mobile || "");

  const handleNext = () => {
    if (!mobile.trim()) return alert("Please enter your mobile number.");
    update({ mobile, emailOrPhone: mobile });
    navigate("/register/password");
  };

  const handleEmail = () => {
    navigate("/register/email");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/register/gender")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your mobile number?</h1>
      <p className="text-gray-500 text-base mb-6">
        Enter the mobile number where you can be contacted. No one will see this on your profile.
      </p>

      <input
        type="tel"
        placeholder="Mobile number"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50 mb-2"
        autoFocus
      />
      <p className="text-sm text-gray-500 mb-6">
        You may receive WhatsApp and SMS notifications from us.{" "}
        <span className="text-[#1877F2] font-semibold">Learn more</span>
      </p>

      <button
        onClick={handleNext}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors mb-3"
      >
        Next
      </button>
      <button
        onClick={handleEmail}
        className="w-full bg-gray-100 text-gray-800 font-semibold py-4 rounded-full text-base hover:bg-gray-200 transition-colors"
      >
        Sign up with email
      </button>

      <div className="flex-1" />
      <button className="text-[#1877F2] font-semibold text-base text-center mt-8">Find my account</button>
    </div>
  );
}