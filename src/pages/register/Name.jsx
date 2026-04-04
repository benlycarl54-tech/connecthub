import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";

export default function Name() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");

  const handleNext = () => {
    if (!firstName.trim()) return alert("Please enter your first name.");
    update({ firstName, lastName });
    navigate("/register/birthday");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      <button onClick={() => navigate("/join")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your name?</h1>
      <p className="text-gray-500 text-base mb-8">Enter the name you use in real life.</p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="flex-1 border-2 border-[#1877F2] rounded-2xl px-4 py-4 text-base outline-none bg-white"
          autoFocus
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:border-[#1877F2] bg-gray-50"
        />
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors"
      >
        Next
      </button>

      <div className="flex-1" />
      <button className="text-[#1877F2] font-semibold text-base text-center mt-8">Find my account</button>
    </div>
  );
}