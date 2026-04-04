import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Settings, Users } from "lucide-react";

export default function TermsStep() {
  const navigate = useNavigate();

  const handleAgree = () => {
    navigate("/register/confirmation");
  };

  const points = [
    {
      icon: FileText,
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-5 py-4">
        <button onClick={() => navigate("/register/password")} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="w-full h-48 bg-gradient-to-br from-teal-200 via-teal-100 to-teal-300 flex items-center justify-center">
        <div className="w-28 h-36 bg-white rounded-xl shadow-lg flex items-center justify-center">
          <div className="w-16 h-20 bg-fb-blue/10 rounded-lg flex items-center justify-center">
            <Users className="w-10 h-10 text-fb-blue" />
          </div>
        </div>
      </div>

      <div className="px-5 py-6 flex-1 flex flex-col">
        <h1 className="text-xl font-bold text-foreground mb-2">
          To sign up, read and agree to our terms
        </h1>

        <h2 className="text-base font-bold text-foreground mb-4">Key points you should know</h2>

        <div className="space-y-5 mb-6">
          {points.map((point, i) => (
            <div key={i} className="flex gap-3">
              <point.icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                {point.text}{" "}
                <span className="text-fb-blue font-semibold">Learn more</span>
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          By selecting Sign up, you agree to our{" "}
          <span className="text-fb-blue">Terms</span>. Learn how we collect, use and share your data in our{" "}
          <span className="text-fb-blue">Privacy Policy</span> and how we use cookies and similar technology in our{" "}
          <span className="text-fb-blue">Cookies Policy</span>.
        </p>

        <Button
          onClick={handleAgree}
          className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base mb-3"
        >
          Sign up
        </Button>

        <p
          onClick={() => navigate("/")}
          className="text-center text-sm font-semibold text-foreground cursor-pointer"
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}