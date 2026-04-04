import { ChevronDown, Pencil } from "lucide-react";
import { useState } from "react";

export default function EditStep3({ formData, setFormData }) {
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    personalDetails: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">How's this look?</h1>
      <p className="text-gray-600 text-sm mb-6">Think of it as a glimpse of you.</p>

      {/* Intro section */}
      <div className="border border-gray-300 rounded-lg mb-4">
        <button
          onClick={() => toggleSection("intro")}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <span className="font-bold text-gray-900">Intro</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.intro ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.intro && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">👤</span>
                <span className="text-gray-900">About you</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Tell people about yourself"
              value={formData.about}
              onChange={e => setFormData({ ...formData, about: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1877F2]"
            />

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📌</span>
                <span className="text-gray-900">Pinned details</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="What's important to show first?"
              value={formData.pinnedDetails}
              onChange={e => setFormData({ ...formData, pinnedDetails: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1877F2]"
            />
          </div>
        )}
      </div>

      {/* Personal details section */}
      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection("personalDetails")}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <span className="font-bold text-gray-900">Personal details</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.personalDetails ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.personalDetails && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
            {formData.currentCity && (
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <span className="text-gray-900">{formData.currentCity}</span>
              </div>
            )}
            {formData.hometown && (
              <div className="flex items-center gap-3">
                <span className="text-lg">🏠</span>
                <span className="text-gray-900">{formData.hometown}</span>
              </div>
            )}
            {formData.relationshipStatus && (
              <div className="flex items-center gap-3">
                <span className="text-lg">💕</span>
                <span className="text-gray-900">{formData.relationshipStatus}</span>
              </div>
            )}
            {formData.highSchool && (
              <div className="flex items-center gap-3">
                <span className="text-lg">🎓</span>
                <span className="text-gray-900">{formData.highSchool}</span>
              </div>
            )}
            {formData.workExperience && (
              <div className="flex items-center gap-3">
                <span className="text-lg">💼</span>
                <span className="text-gray-900">{formData.workExperience}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}