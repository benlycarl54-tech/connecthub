import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, ThumbsUp, Send, Radio, Video } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import { base44 } from "@/api/base44Client";

function getLiveState() {
  try { return JSON.parse(localStorage.getItem("fb_live_state") || "null"); } catch { return null; }
}
function setLiveState(state) {
  localStorage.setItem("fb_live_state", JSON.stringify(state));
}
function getLiveComments() {
  try { return JSON.parse(localStorage.getItem("fb_live_comments") || "[]"); } catch { return []; }
}
function saveLiveComments(comments) {
  localStorage.setItem("fb_live_comments", JSON.stringify(comments));
}

export default function LivePage() {
  const navigate = useNavigate();
  const { currentUser } = useFBAuth();
  const [liveState, setLiveStateLocal] = useState(() => getLiveState());
  const [comments, setComments] = useState(() => getLiveComments());
  const [commentText, setCommentText] = useState("");
  const [reactions, setReactions] = useState({ likes: liveState?.likes || 0, loves: liveState?.loves || 0 });
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [liveTitle, setLiveTitle] = useState("");
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const isAdmin = currentUser?.is_admin;

  // Poll localStorage every 2s to sync comments + reactions for viewers
  useEffect(() => {
    pollRef.current = setInterval(() => {
      const state = getLiveState();
      setLiveStateLocal(state);
      setComments(getLiveComments());
      if (state) setReactions({ likes: state.likes || 0, loves: state.loves || 0 });
    }, 2000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleGoLive = async () => {
    if (!videoFile) return;
    setUploading(true);
    const res = await base44.integrations.Core.UploadFile({ file: videoFile });
    const state = {
      isLive: true,
      videoUrl: res.file_url,
      title: liveTitle || "Admin Live",
      startedAt: new Date().toISOString(),
      likes: 0,
      loves: 0,
      adminName: `${currentUser.firstName} ${currentUser.lastName}`,
      adminAvatar: currentUser.profilePicture || null,
    };
    setLiveState(state);
    setLiveStateLocal(state);
    saveLiveComments([]);
    setComments([]);
    setUploading(false);
  };

  const handleEndLive = () => {
    setLiveState(null);
    setLiveStateLocal(null);
    saveLiveComments([]);
    setComments([]);
    setReactions({ likes: 0, loves: 0 });
  };

  const sendComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Viewer",
      avatar: currentUser?.profilePicture || null,
      text: commentText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...getLiveComments(), newComment];
    saveLiveComments(updated);
    setComments(updated);
    setCommentText("");
  };

  const handleReact = (type) => {
    const state = getLiveState();
    if (!state) return;
    const updated = { ...state, [type]: (state[type] || 0) + 1 };
    setLiveState(updated);
    setLiveStateLocal(updated);
    setReactions(r => ({ ...r, [type]: r[type] + 1 }));
  };

  // Admin: no live yet - show setup
  if (isAdmin && !liveState?.isLive) {
    return (
      <div className="min-h-screen bg-gray-900 max-w-md mx-auto flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/home")} className="w-9 h-9 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-bold text-white text-lg">Go Live</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <Radio className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white font-bold text-xl text-center">Start a Live Video</h2>
          <p className="text-gray-400 text-sm text-center">Upload a video to broadcast live to your followers</p>
          <input
            type="text"
            placeholder="What's your live about?"
            value={liveTitle}
            onChange={e => setLiveTitle(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none text-sm"
          />
          <label className="w-full cursor-pointer">
            <input type="file" accept="video/*" className="hidden" onChange={e => setVideoFile(e.target.files[0])} />
            <div className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed ${videoFile ? "border-green-500 bg-green-900/20" : "border-gray-600"}`}>
              <Video className="w-6 h-6 text-gray-400" />
              <span className="text-gray-300 text-sm">{videoFile ? videoFile.name : "Select video to broadcast"}</span>
            </div>
          </label>
          <button
            onClick={handleGoLive}
            disabled={!videoFile || uploading}
            className="w-full bg-red-600 disabled:bg-gray-700 text-white font-bold py-4 rounded-xl text-base"
          >
            {uploading ? "Uploading..." : "🔴 Go Live"}
          </button>
        </div>
      </div>
    );
  }

  // No live active - viewer sees waiting screen
  if (!liveState?.isLive) {
    return (
      <div className="min-h-screen bg-gray-900 max-w-md mx-auto flex flex-col items-center justify-center px-6">
        <button onClick={() => navigate("/home")} className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <Radio className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">No Live Right Now</h2>
        <p className="text-gray-400 text-sm text-center">Check back soon! The admin will go live here.</p>
      </div>
    );
  }

  // Live is active — show player + chat
  return (
    <div className="min-h-screen bg-black max-w-md mx-auto flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 absolute top-0 left-0 right-0 max-w-md mx-auto z-20">
        <button onClick={() => navigate("/home")} className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-2 bg-red-600 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-bold">LIVE</span>
        </div>
        {isAdmin && (
          <button onClick={handleEndLive} className="bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            End Live
          </button>
        )}
      </div>

      {/* Video player */}
      <div className="w-full bg-black" style={{ aspectRatio: "9/16", maxHeight: "55vh" }}>
        <video
          src={liveState.videoUrl}
          autoPlay
          loop
          muted={false}
          controls={false}
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      {/* Live info */}
      <div className="px-4 py-2 bg-black flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          {liveState.adminAvatar ? (
            <img src={liveState.adminAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{liveState.adminName?.[0]}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{liveState.adminName}</p>
          <p className="text-gray-400 text-xs">{liveState.title}</p>
        </div>
        <div className="flex items-center gap-3 text-gray-300 text-sm">
          <span>❤️ {reactions.loves}</span>
          <span>👍 {reactions.likes}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto px-3 py-2 bg-black space-y-2" style={{ maxHeight: "25vh" }}>
        {comments.map(c => (
          <div key={c.id} className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {c.avatar ? (
                <img src={c.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{c.name[0]}</span>
                </div>
              )}
            </div>
            <div className="bg-white/10 rounded-2xl px-3 py-1.5 max-w-[85%]">
              <span className="text-[#1877F2] text-xs font-semibold">{c.name} </span>
              <span className="text-white text-xs">{c.text}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reaction + input bar */}
      <div className="flex items-center gap-2 px-3 py-3 bg-black border-t border-white/10">
        <button onClick={() => handleReact("likes")} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <ThumbsUp className="w-4 h-4 text-white" />
        </button>
        <button onClick={() => handleReact("loves")} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 text-red-400" />
        </button>
        <input
          type="text"
          placeholder="Comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendComment()}
          className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button onClick={sendComment} disabled={!commentText.trim()} className="w-9 h-9 bg-[#1877F2] disabled:bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}