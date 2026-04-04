import { useState } from "react";
import { X, ChevronDown, ChevronUp, HelpCircle, Settings, Briefcase, Clock, Bookmark, Users, Video, ShoppingBag, UserPlus, Radio, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { Icon: Clock, label: "Memories", path: "#" },
  { Icon: Bookmark, label: "Saved", path: "#" },
  { Icon: Users, label: "Groups", path: "/groups" },
  { Icon: Video, label: "Reels", path: "#" },
  { Icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { Icon: UserPlus, label: "Find friends", path: "/friends" },
  { Icon: Radio, label: "Feeds", path: "/home" },
  { Icon: Calendar, label: "Events", path: "#" },
];

export default function MenuDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useFBAuth();

  // Prevent non-admins from accessing admin panel
  const isAdmin = currentUser?.is_admin || currentUser?.role === 'admin';
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
        <div className="px-4 py-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold">{currentUser?.firstName?.[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 shadow-sm">
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button className="w-full flex items-center gap-3 py-3 px-3 rounded-xl bg-gray-50 hover:bg-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Create Facebook Page</span>
          </button>
        </div>

        {/* Menu Items Grid - 2 columns */}
        <div className="px-4 py-2 grid grid-cols-2 gap-3">
          {MENU_ITEMS.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <button
                key={idx}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-800" />
                <span className="font-semibold text-gray-900 text-xs text-center">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* See More Button */}
        <div className="px-4 py-3">
          <button className="w-full text-center text-gray-700 font-semibold py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
            See more
          </button>
        </div>

        {/* Help and Support */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setExpandedHelp(!expandedHelp)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900 text-sm">Help and support</span>
            </div>
            {expandedHelp ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Settings and Privacy */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setExpandedSettings(!expandedSettings)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900 text-sm">Settings and privacy</span>
            </div>
            {expandedSettings ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSettings && (
            <div className="px-3 py-2 text-sm text-gray-600 space-y-1">
              <p>Settings • Privacy Checkup</p>
              <button
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/");
                }}
                className="text-[#1877F2] font-semibold block"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Admin Panel - Only for admins */}
        {isAdmin && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => {
                navigate("/admin");
                onClose();
              }}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Shield className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-600 text-sm">Admin Panel</span>
            </button>
          </div>
        )}

        {/* Professional Access */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setExpandedAccess(!expandedAccess)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900 text-sm">Professional access</span>
            </div>
            {expandedAccess ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {expandedAccess && (
            <div className="mt-3 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 h-24 mb-3" />
          )}
        </div>

        {/* Public Presence Banner */}
        {expandedAccess && (
          <div className="px-4 py-3">
            <p className="font-bold text-gray-900 text-sm mb-1">Public presence</p>
            <p className="text-xs text-gray-600">Get people to know even more about you</p>
          </div>
        )}
      </div>
    </div>
  );
}