import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

export default function Landing() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, currentUser } = useFBAuth();

  // If already logged in, auto-redirect to home
  useEffect(() => {
    if (currentUser) navigate("/home");
  }, [currentUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Please enter your email/phone and password");
      return;
    }
    const result = login(identifier, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-6 pb-8 max-w-md mx-auto">
      {/* Language picker */}
      <div className="self-end text-gray-500 text-sm flex items-center gap-1 mb-10">
        English (US) <span className="text-xs">▾</span>
      </div>

      {/* Facebook "f" logo */}
      <div className="mb-10">
        <svg viewBox="0 0 50 50" className="w-16 h-16">
          <circle cx="25" cy="25" r="25" fill="#1877F2"/>
          <path d="M33.5 16H29c-1.1 0-2 .9-2 2v3h6.5l-1 6H27V38h-6V27h-4v-6h4v-3c0-4.4 3.6-8 8-8h4.5v6z" fill="white"/>
        </svg>
      </div>

      {/* Login form */}
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Mobile number or email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] bg-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] bg-white"
        />
        <button
          type="submit"
          className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base hover:bg-[#166FE5] transition-colors mt-1"
        >
          Log in
        </button>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}
      </form>

      <button className="font-semibold text-sm mt-4 text-gray-800 underline">
        Forgot password?
      </button>

      <div className="w-full border-t border-gray-200 my-6" />

      <button
        onClick={() => navigate("/join")}
        className="px-6 py-3 bg-[#42B72A] text-white font-bold rounded-full text-base hover:bg-[#36a420] transition-colors"
      >
        Create new account
      </button>

      {/* Meta footer */}
      <div className="mt-auto pt-12 text-gray-500 text-xs font-semibold">
        Meta ©
      </div>
    </div>
  );
}