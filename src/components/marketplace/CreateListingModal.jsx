import { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFBAuth } from "@/context/AuthContext";

const CATEGORIES = ["Electronics", "Furniture", "Fashion", "Books", "Sports", "Home", "Vehicles", "Other"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

export default function CreateListingModal({ onClose, onListingCreated }) {
  const { currentUser } = useFBAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    condition: "Good",
    location: "",
    image_url: null,
  });

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result);
    reader.readAsDataURL(file);
    // Upload to server
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, image_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) return;
    setSubmitting(true);
    await base44.entities.Marketplace.create({
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      location: formData.location.trim() || "Not specified",
      image_url: formData.image_url || null,
      seller_id: currentUser?.id,
      status: "Available",
    });
    setSubmitting(false);
    onListingCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 justify-center">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-gray-700" />
          </button>
          <h2 className="font-bold text-gray-900">Sell an Item</h2>
          <div className="w-8" />
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Photo</label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="preview" className="w-full h-52 object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setFormData(p => ({ ...p, image_url: null })); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center hover:border-[#1877F2] transition-colors"
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-semibold text-gray-600">Add photo</span>
                <span className="text-xs text-gray-400 mt-1">Tap to browse</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Title *</label>
            <input
              type="text"
              placeholder="e.g., iPhone 14 Pro Max"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Price ($) *</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              required
            />
          </div>

          {/* Category & Condition row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={e => setFormData(p => ({ ...p, condition: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2] bg-white"
              >
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g., Brooklyn, NY"
              value={formData.location}
              onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
            <textarea
              placeholder="Describe the item..."
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none h-24"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || uploading || !formData.title.trim() || !formData.price}
            className="w-full bg-[#1877F2] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}