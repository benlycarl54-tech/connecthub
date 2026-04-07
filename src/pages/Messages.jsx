import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useFBAuth } from "@/context/AuthContext";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import NewChatModal from "@/components/messages/NewChatModal";

function getConversations(myId) {
  try { return JSON.parse(localStorage.getItem(`fb_convos_${myId}`) || "[]"); } catch { return []; }
}
function saveConversations(myId, convos) {
  localStorage.setItem(`fb_convos_${myId}`, JSON.stringify(convos));
}

export default function Messages() {
  const location = useLocation();
  const { currentUser } = useFBAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");

  // Load conversations & poll for updates every 3s, refresh verification status
  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      const convos = getConversations(currentUser.id);
      // Refresh verification status for each user
      const updated = await Promise.all(
        convos.map(async (c) => {
          const profiles = await base44.entities.UserProfile.filter({ created_by: c.otherId });
          const isVerified = profiles[0]?.is_verified || false;
          return { ...c, is_verified: isVerified };
        })
      );
      setConversations(updated);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Handle navigation with pre-selected user (e.g. from profile "Message" button)
  useEffect(() => {
    if (currentUser && location.state?.startChatWith) {
      startNewChat(location.state.startChatWith);
    }
  }, [currentUser, location.state]);

  const startNewChat = (user) => {
    const convoId = [currentUser.id, user.id].sort().join("_");
    const existing = conversations.find(c => c.id === convoId);
    if (existing) { setActiveConvo(existing); setShowNewChat(false); return; }
    const newConvo = {
      id: convoId,
      otherId: user.id,
      otherName: `${user.firstName} ${user.lastName}`,
      otherAvatar: user.profilePicture || null,
      is_verified: user.is_verified || false,
      lastMsg: "",
      lastTime: "",
      unread: 0,
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    saveConversations(currentUser.id, updated);
    setActiveConvo(newConvo);
    setShowNewChat(false);
  };

  const handleSend = (convo, msg) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // Update sender's list
    const updatedConvos = conversations.map(c =>
      c.id === convo.id ? { ...c, lastMsg: msg.text, lastTime: now, unread: 0 } : c
    );
    setConversations(updatedConvos);
    saveConversations(currentUser.id, updatedConvos);

    // Sync to recipient's list
    const recipientConvos = getConversations(convo.otherId);
    const existingRecipient = recipientConvos.find(c => c.id === convo.id);
    const recipientEntry = existingRecipient
      ? { ...existingRecipient, lastMsg: msg.text, lastTime: now, unread: (existingRecipient.unread || 0) + 1 }
      : {
          id: convo.id,
          otherId: currentUser.id,
          otherName: `${currentUser.firstName} ${currentUser.lastName}`,
          otherAvatar: currentUser.profilePicture || null,
          is_verified: currentUser.is_verified || false,
          lastMsg: msg.text,
          lastTime: now,
          unread: 1,
        };
    const updatedRecipient = existingRecipient
      ? recipientConvos.map(c => c.id === convo.id ? recipientEntry : c)
      : [recipientEntry, ...recipientConvos];
    saveConversations(convo.otherId, updatedRecipient);
  };

  const handleOpenConvo = (convo) => {
    // Clear unread when opening
    const updated = conversations.map(c => c.id === convo.id ? { ...c, unread: 0 } : c);
    setConversations(updated);
    saveConversations(currentUser.id, updated);
    setActiveConvo({ ...convo, unread: 0 });
    
    // Refresh verification status for the other user (non-blocking)
    base44.entities.UserProfile.filter({ created_by: convo.otherId }).then(profiles => {
      if (profiles[0]) {
        setActiveConvo(prev => ({ ...prev, is_verified: profiles[0].is_verified || false }));
      }
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto pb-0">
      {activeConvo ? (
        <ChatView
          convo={activeConvo}
          currentUser={currentUser}
          onBack={() => setActiveConvo(null)}
          onSend={handleSend}
        />
      ) : (
        <ConversationList
          conversations={conversations}
          onOpen={handleOpenConvo}
          onNewChat={() => setShowNewChat(true)}
          search={search}
          setSearch={setSearch}
          currentUserId={currentUser.id}
        />
      )}

      {showNewChat && (
        <NewChatModal
          onSelect={startNewChat}
          onClose={() => setShowNewChat(false)}
        />
      )}
    </div>
  );
}