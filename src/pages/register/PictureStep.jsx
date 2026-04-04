import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/context/RegisterContext";
import { base44 } from "@/api/base44Client";
import { UserCircle } from "lucide-react";

export default function PictureStep() {
  const navigate = useNavigate();
  const { update } = useRegister();
  const [picture, setPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPicture(file_url);
    update({ profilePicture: file_url });
    setUploading(false);
  };

  const handleNext = () => navigate("/register/welcome");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 py-8 max-w-md mx-auto">
      <div className="w-full mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a profile picture</h1>
        <p className="text-gray-500 text-base">
          Add a profile picture so your friends know it's you. Everyone can see your picture.
        </p>
      </div>

      {/* Avatar */}
      <div
        onClick={() => fileRef.current?.click()}
        className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-white shadow-lg mb-10 relative"
      >
        {picture ? (
          <img src={picture} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserCircle className="w-32 h-32 text-gray-400" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="w-full space-y-3 mt-auto">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-full text-base disabled:opacity-50 hover:bg-[#166FE5] transition-colors"
        >
          {picture ? "Change picture" : "Add picture"}
        </button>
        {picture && (
          <button
            onClick={handleNext}
            className="w-full bg-[#42B72A] text-white font-bold py-3.5 rounded-full text-base hover:bg-[#36a420] transition-colors"
          >
            Save
          </button>
        )}
        <button
          onClick={handleNext}
          className="w-full border border-gray-300 text-gray-800 font-semibold py-3.5 rounded-full text-base hover:bg-gray-50 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}