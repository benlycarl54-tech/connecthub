import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useFBAuth } from "@/context/AuthContext";

export default function Landing() {
  const { currentUser } = useFBAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    } else {
      base44.auth.redirectToLogin(window.location.origin + "/home");
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1877F2] rounded-full animate-spin"></div>
    </div>
  );
}