import { useNavigate } from "react-router-dom";
import { ChevronLeft, UserPlus } from "lucide-react";

const suggestedPeople = [
  { name: "Alex Johnson", mutual: "5 mutual friends", avatar: "AJ", color: "bg-blue-400" },
  { name: "Maria Garcia", mutual: "3 mutual friends", avatar: "MG", color: "bg-pink-400" },
  { name: "David Kim", mutual: "8 mutual friends", avatar: "DK", color: "bg-green-400" },
  { name: "Sarah Wilson", mutual: "2 mutual friends", avatar: "SW", color: "bg-purple-400" },
];

export default function FriendsStep() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/register/welcome")}>
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
          People you may know
        </h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 px-4 py-4">
        <p className="text-gray-500 text-sm mb-5 text-center">
          Add friends to see their posts and stay connected.
        </p>

        <div className="space-y-3">
          {suggestedPeople.map((person, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
              <div className={`w-14 h-14 rounded-full ${person.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-lg">{person.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base">{person.name}</p>
                <p className="text-xs text-gray-500">{person.mutual}</p>
              </div>
              <button className="flex items-center gap-1.5 bg-blue-50 text-[#1877F2] font-semibold px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                <UserPlus className="w-4 h-4" />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base hover:bg-[#166FE5] transition-colors"
        >
          Continue to Facebook
        </button>
      </div>
    </div>
  );
}