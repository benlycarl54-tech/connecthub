import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Join() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-5 pb-8 max-w-md mx-auto">
      <button onClick={() => navigate("/")} className="mb-4 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Facebook</h1>
      <p className="text-gray-500 text-base mb-6">
        Create an account to connect with friends, family and communities of people who share your interests.
      </p>

      {/* Illustration */}
      <div className="rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center" style={{height: 200}}>
        <div className="flex items-end gap-3 px-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-orange-300 flex items-center justify-center text-2xl mb-1">👦</div>
            <div className="bg-white rounded-full px-2 py-0.5 text-xs font-bold text-blue-600 flex items-center gap-1">
              <span>👍</span> Like
            </div>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-xl bg-yellow-200 border-4 border-white shadow flex items-center justify-center text-4xl">🙂</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-pink-300 flex items-center justify-center text-2xl mb-1">👧</div>
            <div className="bg-white rounded-full px-2 py-0.5 text-xs font-bold text-red-500 flex items-center gap-1">
              <span>❤️</span> Love
            </div>
          </div>
        </div>
      </div>

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