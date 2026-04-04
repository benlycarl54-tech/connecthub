import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { User } from "lucide-react";

export default function PictureStep() {
  const navigate = useNavigate();
  const [picture, setPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPicture(file_url);
      localStorage.setItem("reg_picture", file_url);
      setUploading(false);
    }
  };

  const handleSkip = () => {
    navigate("/register/welcome");
  };

  const handleAdd = () => {
    if (picture) {
      navigate("/register/welcome");
    } else {
      fileRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-5 py-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-foreground mb-2">Add a profile picture</h1>
        <p className="text-base text-muted-foreground mb-8">
          Add a profile picture so your friends know it's you. Everyone will be able to see your picture.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-48 h-48 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {picture ? (
            <img src={picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-20 h-20 text-gray-400" />
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="w-full space-y-3">
        <Button
          onClick={handleAdd}
          disabled={uploading}
          className="w-full h-12 rounded-full bg-fb-blue hover:bg-fb-blue-dark text-white font-semibold text-base"
        >
          {uploading ? "Uploading..." : "Add picture"}
        </Button>
        <Button
          variant="outline"
          onClick={handleSkip}
          className="w-full h-12 rounded-full border-border text-foreground font-semibold text-base"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}