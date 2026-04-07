import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Send, Phone, Video, Info, Smile } from "lucide-react";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import VerifiedBadge from "@/components/VerifiedBadge";

const EMOJI_LIST = ["😀","😂","❤️","👍","🔥","😍","🙏","😭","💯","🎉"];

// Messages stored by conversation ID (shared between both users)
function getMessages(convoId) {
  try { return JSON.parse(localStorage.getItem(`fb_msgs_${convoId}`) || "[]"); } catch { return []; }
}
function saveMessages(convoId, msgs) {
  localStorage.setItem(`fb_msgs_${convoId}`, JSON.stringify(msgs));
}

// Format relative time
function getRelativeTime(timeStr) {
  const now = new Date();
  const [hours, mins] = timeStr.split(":").map(Number);
  const msgTime = new Date();
  msgTime.setHours(hours, mins, 0);
  const diffMs = now - msgTime;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return timeStr;
}

export default function ChatView({ convo, currentUser, onBack, onSend }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages and poll for new ones every 1s for real-time sync
  useEffect(() => {
    if (!convo) return;
    const load = () => {
      const msgs = getMessages(convo.id);
      setMessages(msgs);
    };
    load();
    const interval = setInterval(load, 1000);
    return () => clearInterval(interval);
  }, [convo?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !convo) return;
    const msg = {
      id: Date.now(),
      from: currentUser.id,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(convo.id, updated);
    onSend(convo, msg);
    setText("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const addEmoji = (emoji) => {
    setText(t => t + emoji);
    inputRef.current?.focus();
  };

  // Group consecutive messages by sender
  const grouped = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1];
    const isSameGroup = prev && prev.from === msg.from;
    if (isSameGroup) {
      acc[acc.length - 1].msgs.push(msg);
    } else {
      acc.push({ from: msg.from, msgs: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300">
            {convo.otherAvatar ? (
              <img src={convo.otherAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{convo.otherName?.[0] || "?"}</span>
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-gray-900 text-sm truncate">{convo.otherName}</p>
            {convo.is_verified && <VerifiedBadge size={14} />}
          </div>
          <p className="text-xs text-green-500 font-medium">Active now</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Phone className="w-5 h-5 text-[#1877F2]" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Video className="w-5 h-5 text-[#1877F2]" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Info className="w-5 h-5 text-[#1877F2]" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 mb-3">
              {convo.otherAvatar ? (
                <img src={convo.otherAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{convo.otherName?.[0] || "?"}</span>
                </div>
              )}
            </div>
            <p className="font-semibold text-gray-900">{convo.otherName}</p>
            <p className="text-sm text-gray-400 mt-1">Say hi to start the conversation 👋</p>
          </div>
        )}

        {grouped.map((group, gi) => {
          const isMe = group.from === currentUser.id;
          return (
            <div key={gi}>
              {/* Date separator */}
              {gi === 0 && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">Today</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              <div className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"} mb-2`}>
                {group.msgs.map((msg, mi) => {
                  const isFirst = mi === 0;
                  const isLast = mi === group.msgs.length - 1;
                  const relativeTime = getRelativeTime(msg.time);
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar — only for last message in group from other person */}
                      {!isMe && isLast ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 mb-1">
                          {convo.otherAvatar ? (
                            <img src={convo.otherAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">{convo.otherName?.[0]}</span>
                            </div>
                          )}
                        </div>
                      ) : !isMe ? (
                        <div className="w-6 flex-shrink-0" />
                      ) : null}

                      <div className={`flex items-end gap-1.5`}>
                        <div className={`max-w-[72%] px-3.5 py-2 text-sm leading-relaxed
                          ${isMe
                            ? "bg-[#1877F2] text-white"
                            : "bg-gray-100 text-gray-900"
                          }
                          ${isMe
                            ? isFirst && isLast ? "rounded-2xl rounded-br-sm"
                              : isFirst ? "rounded-2xl rounded-br-sm"
                              : isLast ? "rounded-2xl rounded-tr-sm rounded-br-sm"
                              : "rounded-2xl rounded-r-sm"
                            : isFirst && isLast ? "rounded-2xl rounded-bl-sm"
                              : isFirst ? "rounded-2xl rounded-bl-sm"
                              : isLast ? "rounded-2xl rounded-tl-sm rounded-bl-sm"
                              : "rounded-2xl rounded-l-sm"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        {isLast && (
                          <p className={`text-[10px] flex-shrink-0 whitespace-nowrap ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                            {relativeTime}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap">
          {EMOJI_LIST.map(e => (
            <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform">
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-100">
        <button
          onClick={() => setShowEmoji(s => !s)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0"
        >
          <Smile className="w-5 h-5 text-[#1877F2]" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Aa"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none text-gray-900 placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="w-9 h-9 bg-[#1877F2] disabled:bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}