import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { useRegister } from "@/context/RegisterContext";
import BirthdayPicker from "@/components/signup/BirthdayPicker";

export default function BirthdayStep() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [birthday, setBirthday] = useState(data.birthday ? new Date(data.birthday) : null);
  const [showPicker, setShowPicker] = useState(false);

  const age = birthday ? differenceInYears(new Date(), birthday) : null;

  const handleNext = () => {
    if (birthday) {
      update({ birthday: birthday.toISOString() });
      navigate("/register/gender");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 py-4 max-w-md mx-auto">
      <button onClick={() => navigate("/register/name")} className="mb-6 self-start">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">What's your birthday?</h1>
      <p className="text-gray-500 text-base mb-1">
        Choose your date of birth. You can always make this private later.{" "}
        <span className="text-[#1877F2] font-semibold cursor-pointer">
          Why do I need to provide my birthday?
        </span>
      </p>

      <div
        onClick={() => setShowPicker(true)}
        className="mt-5 border border-gray-300 rounded-xl px-4 py-4 cursor-pointer flex flex-col"
      >
        <span className="text-xs text-gray-500 mb-0.5">
          Birthday{age !== null ? ` (${age} years old)` : ""}
        </span>
        <span className={`text-base ${birthday ? "text-gray-900" : "text-gray-400"}`}>
          {birthday ? format(birthday, "MMMM d, yyyy") : "Select your birthday"}
        </span>
      </div>

      <button
        onClick={handleNext}
        disabled={!birthday}
        className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base mt-4 disabled:opacity-40 hover:bg-[#166FE5] transition-colors"
      >
        Next
      </button>

      <div className="flex-1" />
      <p className="text-center text-[#1877F2] font-semibold text-sm pb-4 cursor-pointer">
        Find my account
      </p>

      {showPicker && (
        <BirthdayPicker
          value={birthday || new Date(2000, 0, 1)}
          onSet={date => { setBirthday(date); setShowPicker(false); }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}