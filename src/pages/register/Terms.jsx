import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle, Shield, Settings, Users } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Terms() {
  const navigate = useNavigate();
  const { data } = useRegister();

  const handleSignUp = () => {
    // Save profile to localStorage for persistence
    localStorage.setItem("fbProfile", JSON.stringify(data));
    navigate("/register/confirm");
  };

  const points = [
    {
      icon: UserCircle,
      text: "We use your information to create an account, show ads and content you might like, and improve our products.",
    },
    {
      icon: Shield,
      text: "You may choose to provide information about yourself that could have special protections under privacy laws in your area.",
    },
    {
      icon: Settings,
      text: "You may access, change, or delete your information any time.",
    },
    {
      icon: Users,
      text: "People who use our service may have uploaded your contact information to Facebook.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-8">
      <button onClick={() => navigate("/register/password")} className="px-5 pt-6 mb-2">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Header illustration */}
      <div className="w-full h-48 bg-teal-100 flex items-center justify-center overflow-hidden mb-5">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center text-4xl">📱</div>
          <div className="flex gap-3">
            <div className="w-12 h-8 bg-teal-200 rounded flex items-center justify-center text-xs">💬</div>
            <div className="w-12 h-8 bg-teal-200 rounded flex items-center justify-center text-xs">📸</div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">To sign up, read and agree to our terms</h1>

        <p className="font-bold text-gray-800 mb-3">Key points you should know</p>

        <div className="flex flex-col gap-4 mb-6">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex gap-3 items-start">
                <Icon className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {p.text}{" "}
                  <span className="text-[#1877F2] font-semibold">Learn more</span>
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          By selecting <strong>Sign up</strong>, you agree to our{" "}
          <span className="text-[#1877F2]">Terms</span>. Learn how we collect, use and share your data in our{" "}
          <span className="text-[#1877F2]">Privacy Policy</span> and how we use cookies and similar technology in our{" "}
          <span className="text-[#1877F2]">Cookies Policy.</span>
        </p>

        <button
          onClick={handleSignUp}
          className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors mb-4"
        >
          Sign up
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full text-[#1877F2] font-semibold text-base text-center"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}