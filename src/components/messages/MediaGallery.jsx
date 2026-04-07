import { useState } from "react";
import { X, Image, Mic } from "lucide-react";

export default function MediaGallery({ convoId, onClose }) {
  const [activeTab, setActiveTab] = useState("all");

  const getMediaFromMessages = () => {
    try {
      const msgs = JSON.parse(localStorage.getItem(`fb_msgs_${convoId}`) || "[]");
      return msgs.filter(m => m.image_url || m.voice_url).reverse();
    } catch {
      return [];
    }
  };

  const media = getMediaFromMessages();
  const images = media.filter(m => m.image_url);
  const voiceNotes = media.filter(m => m.voice_url);

  const displayMedia = activeTab === "images" ? images : activeTab === "voice" ? voiceNotes : media;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Shared Media</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 py-2 border-b border-gray-100">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2 font-medium text-sm ${
              activeTab === "all" ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
            }`}
          >
            All ({media.length})
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`pb-2 font-medium text-sm flex items-center gap-1 ${
              activeTab === "images" ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
            }`}
          >
            <Image className="w-4 h-4" /> Images ({images.length})
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`pb-2 font-medium text-sm flex items-center gap-1 ${
              activeTab === "voice" ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-500"
            }`}
          >
            <Mic className="w-4 h-4" /> Voice ({voiceNotes.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">No {activeTab === "all" ? "media" : activeTab === "images" ? "images" : "voice notes"} yet</p>
            </div>
          ) : activeTab === "images" ? (
            <div className="grid grid-cols-3 gap-2">
              {displayMedia.map(msg => (
                <div key={msg.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={msg.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {displayMedia.map(msg => (
                <div key={msg.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mic className="w-5 h-5 text-[#1877F2] flex-shrink-0" />
                  <audio controls className="flex-1 h-8">
                    <source src={msg.voice_url} />
                  </audio>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}