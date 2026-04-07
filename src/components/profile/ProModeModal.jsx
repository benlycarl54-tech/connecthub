import { X, Users, BarChart2, DollarSign } from "lucide-react";

export default function ProModeModal({ user, onClose, onUpgrade }) {
  const picture = user?.profilePicture;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="font-bold text-base text-gray-900">Update to pro mode</h2>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-6">
        {/* Avatar with decorative icons */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-300">
              {picture ? (
                <img src={picture} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{user?.firstName?.[0] || "U"}</span>
                </div>
              )}
            </div>
            {/* Decorative emoji badges */}
            <span className="absolute -top-3 -left-5 text-3xl">👍</span>
            <span className="absolute -top-3 -right-7 text-3xl">📊</span>
            <span className="absolute -bottom-2 -left-4 text-2xl">⭐</span>
            <span className="absolute -bottom-2 -right-2 text-2xl">❤️</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
          Level up your profile with free tools
        </h1>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Reach more people</p>
              <p className="text-gray-500 text-sm mt-0.5">Anyone on Facebook can follow you and tag you publicly in comments or posts.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BarChart2 className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Access insights</p>
              <p className="text-gray-500 text-sm mt-0.5">See how well your content is performing.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Get paid</p>
              <p className="text-gray-500 text-sm mt-0.5">Earn money if you're eligible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-8 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center mb-3 leading-relaxed">
          Facebook shows more info about profiles in pro mode.{" "}
          <span className="text-[#1877F2] font-semibold">Learn more.</span>{" "}
          By selecting "Update your profile," you agree to Meta's{" "}
          <span className="text-[#1877F2] font-semibold">Commercial terms.</span>
        </p>
        <button
          onClick={onUpgrade}
          className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-full text-base"
        >
          Update your profile
        </button>
      </div>
    </div>
  );
}