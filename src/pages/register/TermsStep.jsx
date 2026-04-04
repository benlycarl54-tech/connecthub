import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/context/RegisterContext";

export default function TermsStep() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "there";

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Illustration header */}
      <div className="w-full bg-gradient-to-b from-teal-200 to-teal-100 flex items-center justify-center" style={{height: 220}}>
        <div className="relative flex items-center justify-center">
          {/* Open book/document illustration */}
          <div className="w-32 h-40 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 px-4">
            <div className="w-16 h-2 bg-gray-200 rounded-full" />
            <div className="w-14 h-2 bg-gray-200 rounded-full" />
            <div className="w-16 h-2 bg-gray-200 rounded-full" />
            <div className="w-12 h-2 bg-gray-200 rounded-full" />
            <div className="mt-2 w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
              <span className="text-white font-bold text-lg">f</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 flex-1 flex flex-col">
        <button onClick={() => navigate("/register/password")} className="mb-4 self-start">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Hi {name}, to sign up, agree to our terms
        </h1>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          By tapping Sign up, you agree to our{" "}
          <span className="text-[#1877F2]">Terms</span>,{" "}
          <span className="text-[#1877F2]">Privacy Policy</span> and{" "}
          <span className="text-[#1877F2]">Cookies Policy</span>. You may receive SMS notifications from us and can opt out at any time.
        </p>

        <div className="space-y-4 mb-6">
          {[
            { emoji: "📋", title: "Terms of Service", sub: "Our user agreement on what you can use Facebook for." },
            { emoji: "🔒", title: "Privacy Policy", sub: "See how we use your data to provide an experience that's personal to you." },
            { emoji: "🍪", title: "Cookies Policy", sub: "We use cookies and similar technology." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/register/confirmation")}
          className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base hover:bg-[#166FE5] transition-colors mb-3"
        >
          Sign up
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-center text-sm font-semibold text-gray-700"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}