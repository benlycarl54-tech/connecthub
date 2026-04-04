import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (identifier && password) {
      const profile = JSON.parse(localStorage.getItem("fbRegister") || "{}");
      if (profile.emailOrPhone === identifier && profile.password === password) {
        navigate("/home");
      } else {
        alert("Account not found. Please create an account first, or check your credentials.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 pt-10 pb-6 max-w-lg mx-auto">
      {/* Language */}
      <div className="text-sm text-gray-500 mb-12 flex items-center gap-1 self-center">
        English (US) <span className="text-xs">▾</span>
      </div>

      {/* Facebook Logo */}
      <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mb-16">
        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Mobile number or email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50"
        />
        <button
          type="submit"
          className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base mt-1 hover:bg-[#166FE5] transition-colors"
        >
          Log in
        </button>
      </form>

      <button className="font-bold text-sm mt-4 text-gray-800">Forgot password?</button>

      <div className="flex-1" />

      <div className="w-full flex flex-col items-center gap-4 mt-12">
        <Link
          to="/join"
          className="w-full border-2 border-[#1877F2] text-[#1877F2] font-semibold py-4 rounded-full text-center text-base hover:bg-blue-50 transition-colors"
        >
          Create new account
        </Link>

        {/* Meta wordmark */}
        <div className="flex items-center gap-1 text-gray-500 text-sm font-semibold mt-2">
          <svg viewBox="0 0 100 30" className="w-10 h-5 fill-gray-500">
            <path d="M 5 25 C 5 20 8 15 12 15 C 15 15 17 18 20 22 C 23 18 26 13 30 13 C 35 13 38 20 38 25 L 35 25 C 35 21 33 16 30 16 C 27 16 24 21 21 25 L 19 25 C 16 21 14 16 12 16 C 9 16 8 20 8 25 Z M 45 25 C 45 20 48 13 54 13 C 57 13 59 15 61 18 C 63 15 65 13 68 13 C 74 13 77 20 77 25 L 74 25 C 74 20 72 16 68 16 C 65 16 63 20 61 24 L 61 25 L 58 25 L 58 24 C 56 20 54 16 54 16 C 51 16 48 20 48 25 Z"/>
          </svg>
          Meta
        </div>
      </div>
    </div>
  );
}