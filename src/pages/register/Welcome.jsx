import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../context/RegisterContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { data } = useRegister();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/register/friends");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between px-5 py-10">
      <div className="flex flex-col items-center flex-1 justify-center">
        {/* Facebook wordmark */}
        <p className="text-4xl font-bold text-[#1877F2] mb-12" style={{fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>facebook</p>

        {/* Avatar */}
        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-xl mb-8">
          {data.profilePicture ? (
            <img src={data.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full mb-1" />
              <div className="w-24 h-10 bg-gray-300 rounded-t-3xl" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Welcome to Facebook, {data.firstName}
        </h2>
        <p className="text-gray-500 text-base text-center">Let's start customizing your experience</p>
      </div>

      {/* Refresh/continue button */}
      <button
        onClick={() => navigate("/register/friends")}
        className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}