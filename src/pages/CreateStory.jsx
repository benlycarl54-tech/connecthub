import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Image, Type } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { base44 } from "@/api/base44Client";

const BG_OPTIONS = [
  "bg-gradient-to-br from-purple-500 to-blue-600",
  "bg-gradient-to-br from-red-500 to-orange-400",
  "bg-gradient-to-br from-green-400 to-teal-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-indigo-500 to-violet-600",
];

export default function CreateStory() {
  const navigate = useNavigate();
  const { currentUser } = useFBAuth();
  const [mode, setMode] = useState(null); // "photo" | "text"
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [selectedBg, setSelectedBg] = useState(BG_OPTIONS[0]);
  const [uploading, setUploading] = useState(false);

  const saveStory = async () => {
    setUploading(true);
    let storyObj = {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "You",
      avatar: currentUser?.profilePicture || null,
      userId: currentUser?.id,
      time: "now",
      bg: selectedBg,
    };
    if (mode === "photo" && imageFile) {
      const res = await base44.integrations.Core.UploadFile({ file: imageFile });
      storyObj.img = res.file_url;
    } else {
      storyObj.content = textContent;
    }
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("fb_user_stories") || "[]");
    existing.unshift(storyObj);
    localStorage.setItem("fb_user_stories", JSON.stringify(existing.slice(0, 10)));
    setUploading(false);
    navigate("/home");
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-900 max-w-md mx-auto flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-bold text-white text-lg">Create Story</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          <p className="text-gray-400 text-center">Choose your story type</p>
          <label className="w-full cursor-pointer">
            <input type="file" accept="image/*,video/*" className="hidden" onChange={e => {
              const f = e.target.files[0];
              if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); setMode("photo"); }
            }} />
            <div className="w-full flex items-center gap-4 bg-gray-800 rounded-2xl px-6 py-5">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Photo / Video Story</p>
                <p className="text-gray-400 text-sm">Share a photo or video</p>
              </div>
            </div>
          </label>
          <button onClick={() => setMode("text")} className="w-full flex items-center gap-4 bg-gray-800 rounded-2xl px-6 py-5">
            <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold">Text Story</p>
              <p className="text-gray-400 text-sm">Write something on a colorful background</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 max-w-md mx-auto flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setMode(null)} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={saveStory}
          disabled={uploading || (mode === "text" && !textContent.trim()) || (mode === "photo" && !imageFile)}
          className="bg-[#1877F2] disabled:bg-gray-600 text-white font-semibold px-5 py-2 rounded-full text-sm"
        >
          {uploading ? "Sharing..." : "Share to Story"}
        </button>
      </div>

      {/* Preview */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden relative" style={{ minHeight: 400 }}>
        {mode === "photo" && imagePreview ? (
          <img src={imagePreview} alt="story" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full min-h-96 flex items-center justify-center ${selectedBg}`}>
            <textarea
              autoFocus
              placeholder="Start typing..."
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              className="bg-transparent text-white text-2xl font-bold text-center outline-none resize-none w-full px-8 placeholder-white/60"
              rows={4}
            />
          </div>
        )}
      </div>

      {/* Background picker for text stories */}
      {mode === "text" && (
        <div className="flex gap-3 px-4 py-4 overflow-x-auto">
          {BG_OPTIONS.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedBg(bg)}
              className={`w-10 h-10 rounded-full flex-shrink-0 ${bg} ${selectedBg === bg ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}