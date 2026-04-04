import { useState } from "react";
import { X, ChevronDown, ChevronUp, HelpCircle, Settings, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { icon: "⏰", label: "Memories", path: "#" },
  { icon: "🔖", label: "Saved", path: "#" },
  { icon: "👥", label: "Groups", path: "/groups" },
  { icon: "🛍️", label: "Marketplace", path: "/marketplace" },
  { icon: "👫", label: "Find friends", path: "/friends" },
  { icon: "📺", label: "Feeds", path: "/home" },
  { icon: "🎉", label: "Events", path: "#" },
];

export default function MenuDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useFBAuth();
  const [expandedHelp, setExpandedHelp] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [expandedAccess, setExpandedAccess] = useState(false);

  const handleNavigate = (path) => {
    if (path !== "#") {
      navigate(path);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40" />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 left-full -translate-x-8 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* User Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold">{currentUser?.firstName?.[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <button className="w-full mt-3 flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-100">
            <span className="text-xl">➕</span>
            <span className="font-semibold text-gray-900">Create Facebook Page</span>
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="px-3 py-3 grid grid-cols-2 gap-2">
          {MENU_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(item.path)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="px-3 py-2">
          <button className="w-full text-center text-gray-700 font-semibold py-2.5 hover:bg-gray-100 rounded-lg">
            See more
          </button>
        </div>

        {/* Help and Support */}
        <div className="px-3 py-2 border-t border-gray-200">
          <button
            onClick={() => setExpandedHelp(!expandedHelp)}
            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Help and support</span>
            </div>
            {expandedHelp ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedHelp && (
            <div className="px-3 py-1 text-sm text-gray-600">
              <p className="py-1">Help Center • Support Inbox • Report a Problem</p>
            </div>
          )}
        </div>

        {/* Settings and Privacy */}
        <div className="px-3 py-2 border-t border-gray-200">
          <button
            onClick={() => setExpandedSettings(!expandedSettings)}
            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Settings and privacy</span>
            </div>
            {expandedSettings ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSettings && (
            <div className="px-3 py-1 text-sm text-gray-600">
              <p className="py-1">Settings • Privacy Checkup • Log Out</p>
              <button
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/");
                }}
                className="text-[#1877F2] font-semibold"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Professional Access */}
        <div className="px-3 py-2 border-t border-gray-200">
          <button
            onClick={() => setExpandedAccess(!expandedAccess)}
            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Professional access</span>
            </div>
            {expandedAccess ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}