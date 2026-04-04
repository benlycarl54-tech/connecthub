import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "../../context/RegisterContext";
import BirthdayPicker from "../../components/register/BirthdayPicker";
import { format, differenceInYears } from "date-fns";

export default function Birthday() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [birthday, setBirthday] = useState(data.birthday ? new Date(data.birthday) : new Date());
  const [showPicker, setShowPicker] = useState(false);

  const age = differenceInYears(new Date(), birthday);
  const displayDate = format(birthday, "MMMM d, yyyy");

  const handleNext = () => {
    update({ birthday: birthday.toISOString() });
    navigate("/register/gender");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-6 pb-8">
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPicker(false)} />
          <BirthdayPicker
            value={birthday}
            onChange={setBirthday}
            onCancel={() => setShowPicker(false)}
            onSet={(d) => { setBirthday(d); setShowPicker(false); }}
          />
        </div>
      )}

      <button onClick={() => navigate("/register/name")} className="mb-4">
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your birthday?</h1>
      <p className="text-gray-500 text-base mb-1">
        Choose your date of birth. You can always make this private later.{" "}
        <span className="text-[#1877F2] font-semibold">Why do I need to provide my birthday?</span>
      </p>

      <div className="mt-6 mb-6">
        <button
          onClick={() => setShowPicker(true)}
          className="w-full border border-gray-300 rounded-2xl px-4 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        >
          <p className="text-xs text-gray-400 mb-1">Birthday ({age} years old)</p>
          <p className="text-base text-gray-900 font-medium">{displayDate}</p>
        </button>
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