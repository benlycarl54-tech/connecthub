import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../context/RegisterContext";
import { base44 } from "@/api/base44Client";

export default function Photo() {
  const navigate = useNavigate();
  const { data, update } = useRegister();
  const [preview, setPreview] = useState(data.profilePicture || null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      update({ profilePicture: file_url });
      setPreview(file_url);
    } catch {
      update({ profilePicture: localUrl });
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = (skip = false) => {
    if (!skip && !data.profilePicture && !preview) return;
    navigate("/register/welcome");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-10 pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a profile picture</h1>
      <p className="text-gray-500 text-base mb-10">
        Add a profile picture so your friends know it's you. Everyone will be able to see your picture.
      </p>

      <div className="flex justify-center mb-12">
        <div
          className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden shadow-lg"
          onClick={() => fileRef.current.click()}
        >
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full mb-1" />
              <div className="w-24 h-10 bg-gray-300 rounded-t-3xl" />
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="flex-1" />

      <div className="border-t border-gray-200 pt-5 flex flex-col gap-3">
        <button
          onClick={() => { fileRef.current.click(); }}
          disabled={uploading}
          className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base hover:bg-[#166FE5] transition-colors disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Add picture"}
        </button>
        <button
          onClick={() => handleContinue(true)}
          className="w-full bg-gray-100 text-gray-800 font-semibold py-4 rounded-full text-base hover:bg-gray-200 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}