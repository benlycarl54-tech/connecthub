import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Password() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [password, setPassword] = useState(data.password || "");
  const [remember, setRemember] = useState(true);

  const handleNext = () => {
    if (password.length < 6) return alert("Password must be at least 6 characters.");
    update({ password });
    navigate("/register/terms");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/register/mobile")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a password</h1>
      <p className="text-gray-500 text-base mb-6">
        Create a password with at least 6 letters or numbers. It should be something others can't guess.
      </p>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50 mb-4"
        autoFocus
      />

      <label className="flex items-center gap-3 mb-6 cursor-pointer">
        <button
          type="button"
          onClick={() => setRemember(!remember)}
          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${remember ? "bg-[#1877F2] border-[#1877F2]" : "border-gray-400 bg-white"}`}
        >
          {remember && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </button>
        <span className="text-sm text-gray-700">
          Remember login info. <span className="text-[#1877F2] font-semibold">Learn more</span>
        </span>
      </label>

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