import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function PasswordStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberInfo, setRememberInfo] = useState(true);

  const handleNext = () => {
    if (password.length >= 6) {
      update({ password });
      navigate("/register/terms");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/mobile")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a password</h1>
      <p className="text-gray-500 text-base mb-6">
        Create a password with at least 6 letters or numbers. It should be something others can't guess.
      </p>

      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2] pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <label className="flex items-center gap-3 mb-6 cursor-pointer">
        <div
          onClick={() => setRememberInfo(!rememberInfo)}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            rememberInfo ? "bg-[#1877F2] border-[#1877F2]" : "border-gray-300"
          }`}
        >
          {rememberInfo && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="text-base text-gray-800">
          Save your login info?{" "}
          <span className="text-[#1877F2]">Learn more</span>
        </span>
      </label>

      <button
        onClick={handleNext}
        disabled={password.length < 6}
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