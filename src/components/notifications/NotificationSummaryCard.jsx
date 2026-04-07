import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function NotificationSummaryCard({ 
  type, 
  icon, 
  title, 
  count, 
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-[#1877F2] hover:bg-blue-50 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="text-left">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          {count > 0 && (
            <p className="text-xs text-[#1877F2] font-medium">{count} new</p>
          )}
        </div>
      </div>
      {count > 0 && (
        <div className="w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{count > 9 ? "9+" : count}</span>
        </div>
      )}
      {count === 0 && <ChevronRight className="w-5 h-5 text-gray-300" />}
    </button>
  );
}