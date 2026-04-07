import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image, Smile, MapPin, Globe } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { base44 } from "@/api/base44Client";

export default function CreatePost({ onClose, onPost }) {
  const { currentUser } = useFBAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User";
  const avatar = currentUser?.profilePicture;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newFiles = [...imageFiles, ...files].slice(0, 4);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && imageFiles.length === 0) return;
    setUploading(true);
    const imageUrls = [];
    for (const file of imageFiles) {
      const res = await base44.integrations.Core.UploadFile({ file });
      imageUrls.push(res.file_url);
    }
    
    try {
      // Save post to database (persistent)
      const dbPost = await base44.entities.Post.create({
        author_id: currentUser?.id || "me",
        author_name: fullName,
        author_avatar: avatar || null,
        content: content.trim(),
        image_url: imageUrls[0] || null,
      });
      
      // Also save to localStorage for legacy compatibility
      const newPost = {
        id: dbPost.id || Date.now(),
        authorId: currentUser?.id || "me",
        name: fullName,
        avatar: avatar || null,
        time: "Just now",
        privacy: "🌐",
        content: content.trim(),
        image: imageUrls[0] || null,
        images: imageUrls,
        likes: 0,
        comments: 0,
        shares: 0,
        reactions: "",
        verified: currentUser?.is_verified || false,
      };
      const stored = JSON.parse(localStorage.getItem("fb_user_posts") || "[]");
      stored.unshift(newPost);
      localStorage.setItem("fb_user_posts", JSON.stringify(stored.slice(0, 200)));
      
      if (onPost) onPost(newPost);
    } catch (err) {
      console.error("Post creation error:", err);
    } finally {
      setUploading(false);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="font-bold text-gray-900 text-base">Create post</span>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{fullName[0]}</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
            <button className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-0.5">
              <Globe className="w-3 h-3 text-gray-700" />
              <span className="text-xs font-semibold text-gray-700">Public</span>
            </button>
          </div>
        </div>

        {/* Text input */}
        <textarea
          autoFocus
          placeholder={`What's on your mind, ${currentUser?.firstName || "you"}?`}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full px-4 text-gray-900 text-base outline-none resize-none min-h-[120px] placeholder-gray-400"
          rows={4}
        />

        {/* Image preview gallery */}
        {imagePreviews.length > 0 && (
          <div className="mx-4 mb-3">
            <div className={`grid gap-2 ${imagePreviews.length === 1 ? 'grid-cols-1' : imagePreviews.length === 2 ? 'grid-cols-2' : imagePreviews.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden">
                  <img src={preview} alt="preview" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            {imagePreviews.length < 4 && (
              <p className="text-xs text-gray-500 mt-2">You can add up to 4 images</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageChange} />
              <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                <Image className="w-5 h-5 text-green-500" />
              </div>
            </label>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
              <Smile className="w-5 h-5 text-yellow-400" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
              <MapPin className="w-5 h-5 text-red-400" />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && imageFiles.length === 0) || uploading}
            className="bg-[#1877F2] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-5 py-2 rounded-full text-sm"
          >
            {uploading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}