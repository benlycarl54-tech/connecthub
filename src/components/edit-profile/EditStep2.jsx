import { Music, Tv, Film, Gamepad2, Trophy, MapPin } from "lucide-react";

const INTERESTS = [
  { icon: <Music className="w-6 h-6" />, label: "Music", key: "music" },
  { icon: <Music className="w-6 h-6" />, label: "Hobbies", key: "hobbies" },
  { icon: <Tv className="w-6 h-6" />, label: "TV shows", key: "tvShows" },
  { icon: <Film className="w-6 h-6" />, label: "Movies", key: "movies" },
  { icon: <Gamepad2 className="w-6 h-6" />, label: "Games", key: "games" },
  { icon: <Trophy className="w-6 h-6" />, label: "Sports teams and athletes", key: "sports" },
  { icon: <MapPin className="w-6 h-6" />, label: "Places", key: "places" },
];

export default function EditStep2({ formData, setFormData }) {
  const toggleInterest = (key, value) => {
    const current = formData[key] || [];
    if (current.includes(value)) {
      setFormData({
        ...formData,
        [key]: current.filter(v => v !== value),
      });
    } else {
      setFormData({
        ...formData,
        [key]: [...current, value],
      });
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Now the fun stuff</h1>
      <p className="text-gray-600 text-sm mb-6">What you're into these days.</p>

      <div className="space-y-4">
        {INTERESTS.map(({ icon, label, key }) => (
          <button
            key={key}
            onClick={() => toggleInterest(key, label)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
              (formData[key] || []).includes(label)
                ? "border-[#1877F2] bg-blue-50"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="text-gray-600">{icon}</div>
            <span className="font-semibold text-gray-900 text-left">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}