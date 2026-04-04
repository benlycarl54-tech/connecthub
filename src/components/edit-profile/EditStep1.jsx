import { MapPin, Home, Heart, Building2 } from "lucide-react";

export default function EditStep1({ formData, setFormData }) {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">First the basics</h1>
      <p className="text-gray-600 text-sm mb-6">This info helps people know it's you.</p>

      <div className="space-y-6">
        {/* Current city or town */}
        <div>
          <label className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-900">Current city or town</span>
          </label>
          <input
            type="text"
            placeholder="Where do you live?"
            value={formData.currentCity}
            onChange={e => setFormData({ ...formData, currentCity: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1877F2]"
          />
        </div>

        {/* Hometown */}
        <div>
          <label className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-900">Hometown</span>
          </label>
          <input
            type="text"
            placeholder="Where are you from?"
            value={formData.hometown}
            onChange={e => setFormData({ ...formData, hometown: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1877F2]"
          />
        </div>

        {/* Relationship status */}
        <div>
          <label className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-900">Relationship status</span>
          </label>
          <select
            value={formData.relationshipStatus}
            onChange={e => setFormData({ ...formData, relationshipStatus: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1877F2]"
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="In a relationship">In a relationship</option>
            <option value="Engaged">Engaged</option>
            <option value="Married">Married</option>
            <option value="It's complicated">It's complicated</option>
          </select>
        </div>

        {/* High school */}
        <div>
          <label className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-900">High school or college</span>
          </label>
          <input
            type="text"
            placeholder="School or college name"
            value={formData.highSchool}
            onChange={e => setFormData({ ...formData, highSchool: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1877F2]"
          />
        </div>

        {/* Work experience */}
        <div>
          <label className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-900">Work experience</span>
          </label>
          <input
            type="text"
            placeholder="What do you do?"
            value={formData.workExperience}
            onChange={e => setFormData({ ...formData, workExperience: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1877F2]"
          />
        </div>
      </div>
    </div>
  );
}