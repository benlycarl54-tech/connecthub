import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import EditStep1 from "@/components/edit-profile/EditStep1";
import EditStep2 from "@/components/edit-profile/EditStep2";
import EditStep3 from "@/components/edit-profile/EditStep3";

export default function EditProfileFlow() {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useFBAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentCity: currentUser?.currentCity || "",
    hometown: currentUser?.hometown || "",
    relationshipStatus: currentUser?.relationshipStatus || "",
    highSchool: currentUser?.highSchool || "",
    workExperience: currentUser?.workExperience || "",
    hobbies: currentUser?.hobbies || [],
    music: currentUser?.music || [],
    tvShows: currentUser?.tvShows || [],
    movies: currentUser?.movies || [],
    games: currentUser?.games || [],
    sports: currentUser?.sports || [],
    places: currentUser?.places || [],
    about: currentUser?.about || "",
    pinnedDetails: currentUser?.pinnedDetails || "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    navigate("/profile");
  };

  const handleSave = () => {
    updateCurrentUser(formData);
    navigate("/profile");
  };

  return (
    <div className="fixed inset-0 bg-white max-w-md mx-auto z-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white border-b border-gray-200 z-40">
        <button onClick={handleBack} disabled={step === 1} className="w-9 h-9 flex items-center justify-center disabled:opacity-30">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button onClick={handleClose} className="w-9 h-9 flex items-center justify-center">
          <X className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Steps */}
      {step === 1 && (
        <EditStep1 formData={formData} setFormData={setFormData} />
      )}
      {step === 2 && (
        <EditStep2 formData={formData} setFormData={setFormData} />
      )}
      {step === 3 && (
        <EditStep3 formData={formData} setFormData={setFormData} />
      )}

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-gray-200 space-y-3">
        <div className="flex gap-1 h-1">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`flex-1 rounded-full ${i <= step ? "bg-[#1877F2]" : "bg-gray-300"}`}
            />
          ))}
        </div>
        <button
          onClick={step === 3 ? handleSave : handleNext}
          className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-lg"
        >
          {step === 3 ? "Looks good" : "Next"}
        </button>
      </div>
    </div>
  );
}