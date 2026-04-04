import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Send, Search } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";

function getConversations(myId) {
  try { return JSON.parse(localStorage.getItem(`fb_convos_${myId}`) || "[]"); } catch { return []; }
}
function saveConversations(myId, convos) {
  localStorage.setItem(`fb_convos_${myId}`, JSON.stringify(convos));
}
function getMessages(convoId) {
  try { return JSON.parse(localStorage.getItem(`fb_msgs_${convoId}`) || "[]"); } catch { return []; }
}
function saveMessages(convoId, msgs) {
  localStorage.setItem(`fb_msgs_${convoId}`, JSON.stringify(msgs));
}

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getAllUsers } = useFBAuth();
  const [view, setView] = useState("list"); // "list" | "chat"
  const [activeConvo, setActiveConvo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setConversations(getConversations(currentUser.id));
      // If navigated here with a user to start chat with
      if (location.state?.startChatWith) {
        startNewChat(location.state.startChatWith);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeConvo) {
      setMessages(getMessages(activeConvo.id));
    }
  }, [activeConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConvo = (convo) => {
    setActiveConvo(convo);
    setView("chat");
  };

  const startNewChat = (user) => {
    const convoId = [currentUser.id, user.id].sort().join("_");
    const existing = conversations.find(c => c.id === convoId);
    if (existing) { openConvo(existing); setShowNewChat(false); return; }
    const newConvo = {
      id: convoId,
      otherId: user.id,
      otherName: `${user.firstName} ${user.lastName}`,
      otherAvatar: user.profilePicture || null,
      lastMsg: "",
      lastTime: "",
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    saveConversations(currentUser.id, updated);
    openConvo(newConvo);
    setShowNewChat(false);
  };

  const sendMessage = () => {
    if (!text.trim() || !activeConvo) return;
    const msg = { id: Date.now(), from: currentUser.id, text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(activeConvo.id, updated);

    // Update sender's convo list
    const updatedConvos = conversations.map(c =>
      c.id === activeConvo.id ? { ...c, lastMsg: text.trim(), lastTime: "now" } : c
    );
    setConversations(updatedConvos);
    saveConversations(currentUser.id, updatedConvos);

    // Also sync to recipient's convo list so they can receive it
    const recipientConvos = getConversations(activeConvo.otherId);
    const recipientConvoId = activeConvo.id;
    const existingRecipientConvo = recipientConvos.find(c => c.id === recipientConvoId);
    const recipientConvoEntry = existingRecipientConvo
      ? { ...existingRecipientConvo, lastMsg: text.trim(), lastTime: "now" }
      : {
          id: recipientConvoId,
          otherId: currentUser.id,
          otherName: `${currentUser.firstName} ${currentUser.lastName}`,
          otherAvatar: currentUser.profilePicture || null,
          lastMsg: text.trim(),
          lastTime: "now",
        };
    const updatedRecipientConvos = existingRecipientConvo
      ? recipientConvos.map(c => c.id === recipientConvoId ? recipientConvoEntry : c)
      : [recipientConvoEntry, ...recipientConvos];
    saveConversations(activeConvo.otherId, updatedRecipientConvos);

    setActiveConvo(prev => ({ ...prev, lastMsg: text.trim() }));
    setText("");
  };

  const allUsers = getAllUsers().filter(u => u.id !== currentUser?.id);
  const filteredUsers = allUsers.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) return null;

  if (view === "chat" && activeConvo) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-3 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setView("list")} className="w-9 h-9 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            {activeConvo.otherAvatar ? (
              <img src={activeConvo.otherAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{activeConvo.otherName[0]}</span>
              </div>
            )}
          </div>
          <span className="font-semibold text-gray-900">{activeConvo.otherName}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-white">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hi! 👋</p>
          )}
          {messages.map(msg => {
            const isMe = msg.from === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-[#1877F2] text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-gray-100">
          <input
            type="text"
            placeholder="Aa"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none text-gray-900"
          />
          <button onClick={sendMessage} disabled={!text.trim()} className="w-9 h-9 bg-[#1877F2] disabled:bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <span className="font-bold text-gray-900 text-xl">Chats</span>
        </div>
        <button
          onClick={() => setShowNewChat(!showNewChat)}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[#1877F2] font-bold text-xl"
        >
          +
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Messenger"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* New chat user picker */}
      {showNewChat && (
        <div className="px-4 pb-3">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Start a new conversation</p>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredUsers.slice(0, 20).map(u => (
              <button key={u.id} onClick={() => startNewChat(u)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{u.firstName[0]}</span>
                    </div>
                  )}
                </div>
                <span className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation list */}
      <div className="divide-y divide-gray-50">
        {conversations.length === 0 && !showNewChat && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-semibold text-gray-600">No chats yet</p>
            <p className="text-sm mt-1">Tap + to start a new conversation</p>
          </div>
        )}
        {conversations.map(convo => (
          <button key={convo.id} onClick={() => openConvo(convo)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {convo.otherAvatar ? (
                <img src={convo.otherAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white font-bold">{convo.otherName[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{convo.otherName}</p>
              <p className="text-xs text-gray-500 truncate">{convo.lastMsg || "Say hello!"}</p>
            </div>
            {convo.lastTime && <span className="text-xs text-gray-400 flex-shrink-0">{convo.lastTime}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}