import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { User } from "lucide-react";

export default function WelcomeStep() {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("reg_first_name") || "User";
  const picture = localStorage.getItem("reg_picture");

  useEffect(() => {
    const saveProfile = async () => {
      const profileData = {
        first_name: localStorage.getItem("reg_first_name") || "",
        last_name: localStorage.getItem("reg_last_name") || "",
        birthday: localStorage.getItem("reg_birthday") || "",
        gender: localStorage.getItem("reg_gender") || "",
        mobile_number: localStorage.getItem("reg_mobile") || "",
        email_address: localStorage.getItem("reg_email") || "",
        profile_picture: localStorage.getItem("reg_picture") || "",
        signup_method: localStorage.getItem("reg_method") || "email",
        is_verified: true,
      };
      await base44.entities.UserProfile.create(profileData);
    };
    saveProfile();

    const timer = setTimeout(() => navigate("/register/friends"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <h2 className="text-fb-blue text-2xl font-bold mb-16 tracking-tight" style={{ fontFamily: "serif" }}>
        facebook
      </h2>

      <div className="w-40 h-40 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-8">
        {picture ? (
          <img src={picture} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-16 h-16 text-gray-400" />
        )}
      </div>

      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Welcome to Facebook, {firstName}
      </h1>
      <p className="text-base text-muted-foreground">Let's start customizing your experience</p>
    </div>
  );
}