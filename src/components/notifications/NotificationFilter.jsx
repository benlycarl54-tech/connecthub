export default function NotificationFilter({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "all", label: "All", icon: "🔔" },
    { id: "friend_request", label: "Friend Requests", icon: "👥" },
    { id: "new_follower", label: "Followers", icon: "📈" },
    { id: "group_invite", label: "Groups", icon: "👫" },
    { id: "mention", label: "Mentions", icon: "📢" },
    { id: "message", label: "Messages", icon: "💬" },
  ];

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-gray-100 sticky top-12 z-20">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.id
              ? "bg-[#1877F2] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}