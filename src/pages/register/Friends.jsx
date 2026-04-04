import { useNavigate } from "react-router-dom";
import { ChevronLeft, Users } from "lucide-react";

export default function Friends() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <div className="flex items-center mb-4">
        <button onClick={() => navigate("/register/welcome")} className="mr-4">
          <ChevronLeft className="w-7 h-7 text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Add your friends</h2>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-12">
        {/* Friend card illustration */}
        <div className="w-32 h-36 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl flex flex-col items-center justify-end pb-4 mb-6 shadow-lg">
          <div className="w-12 h-12 bg-blue-300 rounded-full mb-2 flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-600" />
          </div>
          <div className="w-16 h-2 bg-blue-800 rounded-full mb-1 opacity-60" />
          <div className="w-12 h-2 bg-blue-800 rounded-full opacity-40" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">No friend suggestions yet</h3>
        <p className="text-gray-500 text-sm text-center leading-relaxed max-w-xs">
          Try searching for people you want to add. You can also import your contacts to get better friend suggestions.
        </p>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors"
      >
        Next
      </button>
    </div>
  );
}