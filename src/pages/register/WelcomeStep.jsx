import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/context/RegisterContext";
import { base44 } from "@/api/base44Client";

export default function WelcomeStep() {
  const navigate = useNavigate();
  const { data } = useRegister();
  const firstName = data.firstName || "Friend";
  const picture = data.profilePicture;

  useEffect(() => {
    // Save profile to database
    const save = async () => {
      if (data.firstName) {
        await base44.entities.UserProfile.create({
          first_name: data.firstName || "",
          last_name: data.lastName || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          mobile_number: data.mobileNumber || "",
          email_address: data.emailAddress || "",
          profile_picture: data.profilePicture || "",
          signup_method: data.signupMethod || "email",
          is_verified: true,
        });
      }
    };
    save();

    const timer = setTimeout(() => navigate("/register/friends"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 max-w-md mx-auto">
      <span className="text-[#1877F2] font-bold text-3xl mb-16" style={{fontFamily: 'Georgia, serif'}}>
        facebook
      </span>

      <div className="w-36 h-36 rounded-full bg-gray-200 border-4 border-[#1877F2] shadow-xl flex items-center justify-center overflow-hidden mb-8">
        {picture ? (
          <img src={picture} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl font-bold text-gray-400">
            {firstName[0]?.toUpperCase()}
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Welcome to Facebook, {firstName}! 🎉
      </h1>
      <p className="text-gray-500 text-center text-base">
        Your account has been created. Let's get started!
      </p>

      <div className="mt-8 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#1877F2] animate-bounce" style={{animationDelay: '0ms'}}/>
        <div className="w-2 h-2 rounded-full bg-[#1877F2] animate-bounce" style={{animationDelay: '150ms'}}/>
        <div className="w-2 h-2 rounded-full bg-[#1877F2] animate-bounce" style={{animationDelay: '300ms'}}/>
      </div>
    </div>
  );
}