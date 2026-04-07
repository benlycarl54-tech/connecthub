import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFBAuth } from "@/context/AuthContext";
import { loadNotificationsForUser, markAllRead, getNotificationsByType } from "@/context/AuthContext";
import NotificationFilter from "@/components/notifications/NotificationFilter";

const WELCOME_NOTIF = {
  id: "welcome",
  type: "welcome",
  text: "Welcome to Facebook! Tap to find people you know.",
  time: "Just now",
  read: false,
  isFB: true,
};

// Icon per notification type
const TYPE_ICON = {
  follow: "👤",
  like: "👍",
  love: "❤️",
  comment: "💬",
  welcome: "📘",
  friend_request: "👥",
  friend_accepted: "✅",
  new_follower: "📈",
  group_invite: "👫",
  mention: "📢",
  message: "💬",
};

export default function NotificationsPage() {
   const navigate = useNavigate();
   const { currentUser, acceptFriendRequest, declineFriendRequest } = useFBAuth();
   const [notifs, setNotifs] = useState([]);
   const [activeFilter, setActiveFilter] = useState("all");

   useEffect(() => {
     if (!currentUser) return;
     const stored = loadNotificationsForUser(currentUser.id);
     const all = stored.length ? stored : [WELCOME_NOTIF];
     if (!all.find(n => n.id === "welcome")) all.push(WELCOME_NOTIF);
     setNotifs(all);
     markAllRead(currentUser.id);
   }, [currentUser?.id]);

   const filteredNotifs = activeFilter === "all" 
     ? notifs 
     : getNotificationsByType(notifs, activeFilter);

   const newNotifs = filteredNotifs.filter(n => !n.read);
   const earlierNotifs = filteredNotifs.filter(n => n.read);

   const handleNotificationClick = (notif) => {
     if (notif.type === "friend_request") {
       navigate("/friends");
     } else if (notif.type === "new_follower" || notif.type === "follow") {
       navigate("/friends");
     } else if (notif.type === "group_invite") {
       navigate("/groups");
     } else if (notif.type === "mention" || notif.type === "comment") {
       navigate("/home");
     } else if (notif.type === "message") {
       navigate("/messages");
     }
   };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <button onClick={() => navigate("/search")} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Filter buttons */}
      <NotificationFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="px-4 pt-4">
        {newNotifs.length > 0 && (
          <div className="mb-4">
            <p className="font-bold text-gray-900 mb-2">New</p>
            <div className="space-y-1">
              {newNotifs.map((n, i) => (
                <NotifItem 
                  key={n.id || i} 
                  notif={n} 
                  onClick={() => handleNotificationClick(n)}
                  onAccept={n.requestId ? () => acceptFriendRequest(n.requestId) : null}
                  onDecline={n.requestId ? () => declineFriendRequest(n.requestId) : null}
                />
              ))}
            </div>
          </div>
        )}

        {earlierNotifs.length > 0 && (
          <div>
            <p className="font-bold text-gray-900 mb-2">Earlier</p>
            <div className="space-y-1">
              {earlierNotifs.map((n, i) => (
                <NotifItem key={n.id || i} notif={n} onClick={() => {}} />
              ))}
            </div>
          </div>
        )}

        {notifs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-5xl mb-4">🔔</span>
            <p className="font-bold text-gray-900">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">When someone likes, comments, or follows you, you'll see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotifItem({ notif, onClick, onAccept, onDecline }) {
   const icon = TYPE_ICON[notif.type] || "🔔";
   const isFriendRequest = notif.type === "friend_request";

   return (
     <div className={`rounded-xl overflow-hidden ${!notif.read ? "bg-[#EBF5FF]" : ""}`}>
       <div
         className="flex items-center gap-3 px-2 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
         onClick={onClick}
       >
         {/* Avatar */}
         <div className="relative flex-shrink-0">
           {notif.isFB ? (
             <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center shadow-sm">
               <span className="text-white font-bold text-3xl leading-none" style={{ fontFamily: "Georgia, serif" }}>f</span>
             </div>
           ) : notif.avatar ? (
             <img src={notif.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
           ) : (
             <div className={`w-14 h-14 rounded-full ${notif.avatarColor || "bg-[#1877F2]"} flex items-center justify-center`}>
               <span className="text-white font-bold text-xl">{notif.avatarInitial || "?"}</span>
             </div>
           )}
           {/* Type badge */}
           <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center border-2 border-white text-[11px]">
             {icon}
           </div>
         </div>

         <div className="flex-1 min-w-0">
           <p className="text-sm text-gray-900 leading-snug">
             {notif.actorName && <span className="font-bold">{notif.actorName} </span>}
             <span>{notif.actorName ? notif.text.replace(notif.actorName + " ", "") : notif.text}</span>
           </p>
           <p className={`text-xs mt-1 font-semibold ${!notif.read ? "text-[#1877F2]" : "text-gray-400"}`}>{notif.time}</p>
         </div>

         {!isFriendRequest && (
           <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 flex-shrink-0">
             <MoreHorizontal className="w-5 h-5 text-gray-500" />
           </button>
         )}
       </div>

       {/* Friend request action buttons */}
       {isFriendRequest && (
         <div className="flex gap-2 px-3 pb-3">
           <button
             onClick={(e) => {
               e.stopPropagation();
               onAccept?.();
             }}
             className="flex-1 bg-[#1877F2] text-white text-sm font-bold py-2 rounded-lg hover:bg-[#166FE5]"
           >
             Accept
           </button>
           <button
             onClick={(e) => {
               e.stopPropagation();
               onDecline?.();
             }}
             className="flex-1 bg-gray-200 text-gray-800 text-sm font-bold py-2 rounded-lg hover:bg-gray-300"
           >
             Decline
           </button>
         </div>
       )}
     </div>
   );
}