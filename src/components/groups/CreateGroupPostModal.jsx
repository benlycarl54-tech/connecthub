import { useState, useRef } from "react";
import { X, Image as ImageIcon, Smile } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

export default function CreateGroupPostModal({ groupId, onClose, onPostCreated }) {
  const { currentUser, postToGroup } = useFBAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setImagePreview(result);
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!content.trim() && !image) return;

    const newPost = postToGroup(groupId, {
      author_name: `${currentUser?.firstName || "User"} ${currentUser?.lastName || ""}`.trim(),
      author_avatar: currentUser?.profilePicture || null,
      author_id: currentUser?.id,
      content: content.trim(),
      image: image,
      author_color: "bg-[#1877F2]",
      time: "Just now",
      privacy: "🔒",
    });

    onPostCreated(newPost);
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create Post</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {currentUser?.profilePicture ? (
              <img src={currentUser.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{currentUser?.firstName?.[0]}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-gray-500">🔒 Group</p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full mt-4 p-3 text-lg outline-none resize-none placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2]"
          rows={5}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mt-3 rounded-lg overflow-hidden">
            <img src={imagePreview} alt="preview" className="w-full max-h-72 object-cover" />
            <button
              onClick={() => { setImage(null); setImagePreview(null); }}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <ImageIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Photo</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Smile className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Emoji</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() && !image}
          className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition-colors ${
            content.trim() || image
              ? "bg-[#1877F2] text-white hover:bg-[#166FE5]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Post to Group
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}