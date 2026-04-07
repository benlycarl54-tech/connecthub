import { MapPin, Mail, Phone, Star, Cake, Briefcase, GraduationCap, Heart } from "lucide-react";
import { format } from "date-fns";

export default function AboutSection({ user, theme }) {
  const birthday = user.birthday ? new Date(user.birthday) : null;

  const rows = [
    birthday && { icon: <Cake className="w-4 h-4 text-gray-500" />, text: format(birthday, "MMMM d, yyyy"), label: "Birthday" },
    user.gender && { icon: <span className="text-base">👤</span>, text: user.gender.charAt(0).toUpperCase() + user.gender.slice(1), label: "Gender" },
    (user.location || user.currentCity) && { icon: <MapPin className="w-4 h-4 text-gray-500" />, text: user.location || user.currentCity, label: "Lives in" },
    user.hometown && { icon: <span className="text-base">🏠</span>, text: user.hometown, label: "From" },
    user.relationshipStatus && { icon: <Heart className="w-4 h-4 text-red-400" />, text: user.relationshipStatus, label: "Relationship" },
    user.workExperience && { icon: <Briefcase className="w-4 h-4 text-gray-500" />, text: user.workExperience, label: "Works at" },
    user.highSchool && { icon: <GraduationCap className="w-4 h-4 text-gray-500" />, text: user.highSchool, label: "Studied at" },
    user.emailAddress && { icon: <Mail className="w-4 h-4 text-gray-500" />, text: user.emailAddress, label: "Email" },
    user.mobileNumber && { icon: <Phone className="w-4 h-4 text-gray-500" />, text: user.mobileNumber, label: "Phone" },
    { icon: <Star className="w-4 h-4 text-yellow-400" />, text: theme.badge, label: "Badge" },
  ].filter(Boolean);

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <h2 className="font-bold text-base text-gray-900 mb-4">About</h2>

      {/* Bio */}
      {(user.bio || theme.bio) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{user.bio || theme.bio}</p>
        </div>
      )}

      {/* Detail rows */}
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-50">
              {row.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400">{row.label}</p>
              <p className="text-sm text-gray-800 font-medium">{row.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Badges</p>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 ${theme.badgeColor} rounded-full flex items-center justify-center text-lg`}>
            {theme.badgeIcon}
          </div>
          <span className="text-sm font-semibold text-gray-800">{theme.badge}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${theme.badge2Color} rounded-full flex items-center justify-center text-lg`}>
            {theme.badge2Icon}
          </div>
          <span className="text-sm font-semibold text-gray-800">{theme.badge2}</span>
        </div>
      </div>
    </div>
  );
}