import { Search, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConversationList({ conversations, onOpen, onNewChat, search, setSearch, currentUserId }) {
  const navigate = useNavigate();

  const filtered = conversations.filter(c =>
    c.otherName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-lg">‹</span>
          </button>
          <span className="font-bold text-gray-900 text-xl">Chats</span>
        </div>
        <button
          onClick={onNewChat}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
          title="New message"
        >
          <Edit className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">💬</p>
            <p className="font-semibold text-gray-600 text-sm">
              {search ? `No chats matching "${search}"` : "No conversations yet"}
            </p>
            {!search && (
              <button onClick={onNewChat} className="mt-3 text-[#1877F2] text-sm font-semibold">
                Start a new chat
              </button>
            )}
          </div>
        )}

        {filtered.map(convo => (
          <button
            key={convo.id}
            onClick={() => onOpen(convo)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors relative"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                {convo.otherAvatar ? (
                  <img src={convo.otherAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{convo.otherName?.[0] || "?"}</span>
                  </div>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>

            {/* Text */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${convo.unread ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}>
                  {convo.otherName}
                </p>
                {convo.lastTime && (
                  <span className={`text-xs flex-shrink-0 ml-2 ${convo.unread ? "text-[#1877F2] font-semibold" : "text-gray-400"}`}>
                    {convo.lastTime}
                  </span>
                )}
              </div>
              <p className={`text-xs truncate mt-0.5 ${convo.unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                {convo.lastMsg || "Tap to say hello 👋"}
              </p>
            </div>

            {/* Unread badge */}
            {convo.unread > 0 && (
              <span className="w-5 h-5 bg-[#1877F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                {convo.unread > 9 ? "9+" : convo.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}