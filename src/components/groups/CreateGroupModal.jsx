import { useState } from "react";
import { X, Lock, Globe } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

export default function CreateGroupModal({ onClose, onGroupCreated }) {
  const { currentUser, createGroup } = useFBAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "private",
    icon: "👥",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newGroup = createGroup({
      name: formData.name.trim(),
      description: formData.description.trim(),
      privacy: formData.privacy,
      icon: formData.icon,
      owner_id: currentUser?.id,
    });

    if (newGroup) {
      onGroupCreated(newGroup);
    }
  };

  const emojiOptions = ["👥", "🎵", "📚", "⚽", "🍕", "🎮", "🎨", "📸", "🚗", "🏡"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-4 animation-in slide-in-from-bottom">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Group</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Group Icon</label>
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl transition-all ${
                    formData.icon === emoji
                      ? "bg-blue-100 ring-2 ring-[#1877F2]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Description (optional)</label>
            <textarea
              placeholder="What's this group about?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none h-24"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Privacy</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, privacy: "private" }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
                  formData.privacy === "private"
                    ? "border-[#1877F2] bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold">Private</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, privacy: "public" }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
                  formData.privacy === "public"
                    ? "border-[#1877F2] bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">Public</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.privacy === "private" 
                ? "Only invited members can see and post"
                : "Anyone can see, only invited members can post"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#1877F2] text-white font-semibold py-2.5 rounded-lg hover:bg-[#166FE5]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}