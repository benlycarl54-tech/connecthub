import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Join() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-5">Join Facebook</h1>

      {/* Illustration */}
      <div className="rounded-2xl overflow-hidden mb-5" style={{background: 'linear-gradient(135deg, #f8d7d7 0%, #fce4e4 100%)', minHeight: 180}}>
        <div className="flex items-center justify-center h-44 relative">
          <div className="flex items-center gap-2">
            {/* Heart */}
            <div className="bg-red-400 rounded-full w-14 h-14 flex items-center justify-center text-white text-2xl">❤️</div>
            {/* Photo frame */}
            <div className="bg-yellow-400 rounded-lg w-24 h-20 flex items-center justify-center border-4 border-yellow-500">
              <span className="text-3xl">👨‍👩‍👧</span>
            </div>
            {/* Thumbs up */}
            <div className="text-5xl">👍</div>
            {/* Birthday cake */}
            <div className="absolute top-2 right-8 text-3xl">🎂</div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-base mb-6 leading-relaxed">
        Create an account to connect with friends, family and communities of people who share your interests.
      </p>

      <button
        onClick={() => navigate("/register/name")}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base mb-3 hover:bg-[#166FE5] transition-colors"
      >
        Create new account
      </button>

      <button className="w-full bg-gray-100 text-gray-800 font-semibold py-4 rounded-full text-base hover:bg-gray-200 transition-colors">
        Find my account
      </button>
    </div>
  );
}