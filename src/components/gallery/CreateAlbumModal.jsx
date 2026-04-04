import { useState } from "react";
import { X } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

export default function CreateAlbumModal({ userId, onClose, onAlbumCreated }) {
  const { createAlbum } = useFBAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newAlbum = createAlbum(userId, {
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    if (newAlbum) {
      onAlbumCreated(newAlbum);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create Album</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Album Title</label>
            <input
              type="text"
              placeholder="e.g., Summer Vacation"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Description (optional)</label>
            <textarea
              placeholder="Add details about this album..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none h-20"
            />
          </div>

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