import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, MessageSquare, Share2, X, Send, Play, Volume2, VolumeX } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useFBAuth, pushNotification } from "@/context/AuthContext";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const SAMPLE_COMMENTS = [
  ["Great post! 😊", "Love this!", "So inspiring ❤️", "Amazing! 🔥", "Thanks for sharing"],
  ["This is awesome!", "Keep it up 💪", "Beautiful 😍", "Wow, incredible!", "So cool 🙌"],
  ["Haha love it 😂", "Miss you!", "Blessed 🙏", "Goals! ✨", "You look amazing"],
];

function getInitialComments(postId, count) {
  const pool = SAMPLE_COMMENTS[postId % 3];
  const names = ["Alice J.", "Bob K.", "Carol M.", "David L.", "Eva R.", "Frank T."];
  const avatarColors = ["bg-pink-400", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"];
  return Array.from({ length: Math.min(count, 3) }, (_, i) => ({
    id: i,
    name: names[(postId + i) % names.length],
    color: avatarColors[(postId + i) % avatarColors.length],
    text: pool[i % pool.length],
    time: `${i + 1}h`,
    likes: Math.floor(Math.random() * 20),
    replies: [],
  }));
}

export default function PostCard({ post, authorName, authorAvatar, authorVerified, authorColor, authorId: authorIdProp }) {
  const { currentUser } = useFBAuth();
  const navigate = useNavigate();
  const [reaction, setReaction] = useState(null);
  const [likesCount, setLikesCount] = useState(() => {
    const saved = localStorage.getItem(`post_likes_${post.id}`);
    return saved ? parseInt(saved) : (post.likes || 0);
  });
  const [userLiked, setUserLiked] = useState(() => {
    return JSON.parse(localStorage.getItem(`post_liked_by_${post.id}`) || '[]').includes(currentUser?.id);
  });
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(() => getInitialComments(post.id, post.comments || 0));
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // comment id
  const [replyText, setReplyText] = useState("");
  const [reactionTimer, setReactionTimer] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);

  const authorId = authorIdProp || post.authorId;
  const name = authorName || post.name;
  const avatar = authorAvatar || post.avatar;
  const verified = authorVerified || post.verified;
  const initials = name?.[0]?.toUpperCase() || "?";
  const bgColor = authorColor || "bg-[#1877F2]";

  const handleReactionHoldStart = () => {
    const t = setTimeout(() => setShowReactions(true), 400);
    setReactionTimer(t);
  };
  const handleReactionHoldEnd = () => {
    clearTimeout(reactionTimer);
  };

  const sendReactionNotif = (emoji) => {
    if (!currentUser || !authorId || authorId === currentUser.id || authorId.startsWith("feed_")) return;
    const typeMap = { "👍": "like", "❤️": "love", "😂": "like", "😮": "like", "😢": "like", "😡": "like" };
    const textMap = { "👍": "liked", "❤️": "loved", "😂": "reacted 😂 to", "😮": "reacted 😮 to", "😢": "reacted 😢 to", "😡": "reacted 😡 to" };
    pushNotification(authorId, {
      type: typeMap[emoji] || "like",
      text: `${currentUser.firstName} ${currentUser.lastName} ${textMap[emoji] || "liked"} your post.`,
      avatar: currentUser.profilePicture || null,
      avatarInitial: currentUser.firstName?.[0] || "?",
      avatarColor: "bg-[#1877F2]",
      actorName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
  };

  const pickReaction = (r) => {
    setShowReactions(false);
    if (reaction === r) {
      setReaction(null);
      setLikesCount(l => l - 1);
    } else {
      if (!reaction) setLikesCount(l => l + 1);
      setReaction(r);
      sendReactionNotif(r);
    }
  };

  const toggleLike = () => {
    if (showReactions) { setShowReactions(false); return; }
    const likedKey = `post_liked_by_${post.id}`;
    const likedUsers = JSON.parse(localStorage.getItem(likedKey) || '[]');
    const userId = currentUser?.id;

    if (userLiked) {
      setUserLiked(false);
      setLikesCount(l => l - 1);
      const updated = likedUsers.filter(id => id !== userId);
      localStorage.setItem(likedKey, JSON.stringify(updated));
      localStorage.setItem(`post_likes_${post.id}`, (likesCount - 1).toString());
    } else {
      setUserLiked(true);
      setLikesCount(l => l + 1);
      if (userId && !likedUsers.includes(userId)) {
        likedUsers.push(userId);
        localStorage.setItem(likedKey, JSON.stringify(likedUsers));
      }
      localStorage.setItem(`post_likes_${post.id}`, (likesCount + 1).toString());
      if (authorId && authorId !== userId && !authorId.startsWith("feed_")) {
        sendReactionNotif("❤️");
      }
    }
    setReaction(userLiked ? null : "👍");
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "You",
      avatar: currentUser?.profilePicture || null,
      color: "bg-[#1877F2]",
      text: commentText.trim(),
      time: "Just now",
      likes: 0,
      replies: [],
    };
    setComments(prev => [...prev, newComment]);
    setCommentText("");
    if (currentUser && authorId && authorId !== currentUser.id && !authorId.startsWith("feed_")) {
      pushNotification(authorId, {
        type: "comment",
        text: `${currentUser.firstName} ${currentUser.lastName} commented: "${commentText.trim().slice(0, 40)}${commentText.trim().length > 40 ? "…" : ""}"`,
        avatar: currentUser.profilePicture || null,
        avatarInitial: currentUser.firstName?.[0] || "?",
        avatarColor: "bg-[#1877F2]",
        actorName: `${currentUser.firstName} ${currentUser.lastName}`,
      });
    }
  };

  const submitReply = (commentId) => {
    if (!replyText.trim()) return;
    const reply = {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "You",
      avatar: currentUser?.profilePicture || null,
      color: "bg-[#1877F2]",
      text: replyText.trim(),
      time: "Just now",
      likes: 0,
    };
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
    ));
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="bg-white mb-2 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => authorId && navigate(`/user/${authorId}`)}
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
          >
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
            )}
          </button>
          <div>
            <div className="flex items-center gap-1">
              <button onClick={() => authorId && navigate(`/user/${authorId}`)} className="font-semibold text-gray-900 text-sm leading-tight hover:underline">{name}</button>
              {verified && <VerifiedBadge size={15} />}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{post.time}</span>
              <span>·</span>
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg font-bold">···</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-2 text-sm text-gray-900 leading-relaxed">{post.content}</p>
      )}

      {/* Image */}
      {post.image && !post.video && (
        <img src={post.image} alt="post" className="w-full object-cover" style={{ maxHeight: 360 }} />
      )}

      {/* Video Post */}
      {post.video && (
        <div className="relative bg-black">
          {!videoPlaying ? (
            <div className="relative cursor-pointer" onClick={() => setVideoPlaying(true)}>
              <img src={post.videoThumb} alt="video" className="w-full object-cover" style={{ maxHeight: 240 }} onError={e => { e.target.style.display = "none"; }} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-14 h-14 bg-black/70 rounded-full flex items-center justify-center">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                <span className="text-white text-xs font-semibold">{post.views} views</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={post.video}
                autoPlay
                muted={muted}
                controls={false}
                className="w-full"
                style={{ maxHeight: 280, objectFit: "contain" }}
                onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current.pause()}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => setMuted(m => !m)} className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                  {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
                <button onClick={() => setVideoPlaying(false)} className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                <span className="text-white text-xs font-semibold">{post.views} views</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {reaction ? (
            <span className="text-sm">{reaction}</span>
          ) : (
            <span className="text-sm">👍 ❤️</span>
          )}
          <span className="text-xs text-gray-500 ml-1">{likesCount}</span>
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-gray-500 hover:underline"
        >
          {comments.length} comments · {post.shares || 0} shares
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100" />

      {/* Action buttons */}
      <div className="flex px-1 py-1 relative">
        {showReactions && (
          <div className="absolute bottom-12 left-2 bg-white rounded-full shadow-xl border border-gray-200 flex items-center px-3 py-2 gap-3 z-50">
            {REACTIONS.map(r => (
              <button
                key={r}
                onClick={() => pickReaction(r)}
                className={`text-2xl hover:scale-125 transition-transform ${reaction === r ? "scale-125" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 transition-colors ${userLiked ? "text-red-500" : "text-gray-500"}`}
        >
          {userLiked ? (
            <span className="text-base">❤️</span>
          ) : (
            <ThumbsUp className="w-5 h-5" />
          )}
          <span className="text-sm font-semibold">{userLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100">
          {/* Comment list */}
          <div className="px-4 pt-3 space-y-3 max-h-96 overflow-y-auto">
            {comments.map(c => (
              <div key={c.id}>
                {/* Top-level comment */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${c.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{c.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                      <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                      <p className="text-sm text-gray-800">{c.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-2">
                      <span className="text-xs text-gray-500">{c.time}</span>
                      <button className="text-xs font-semibold text-gray-500 hover:text-gray-800">Like</button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        className="text-xs font-semibold text-[#1877F2] hover:text-blue-700"
                      >
                        Reply
                      </button>
                      {c.likes > 0 && <span className="text-xs text-gray-400">👍 {c.likes}</span>}
                    </div>

                    {/* Nested replies */}
                    {c.replies?.length > 0 && (
                      <div className="mt-2 ml-2 space-y-2 border-l-2 border-gray-200 pl-3">
                        {c.replies.map(r => (
                          <div key={r.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                              {r.avatar ? (
                                <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full ${r.color} flex items-center justify-center`}>
                                  <span className="text-white text-[10px] font-bold">{r.name[0]}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-2xl px-3 py-1.5 inline-block max-w-full">
                                <p className="text-xs font-semibold text-gray-900">{r.name}</p>
                                <p className="text-sm text-gray-800">{r.text}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 px-2">
                                <span className="text-xs text-gray-500">{r.time}</span>
                                <button className="text-xs font-semibold text-gray-500 hover:text-gray-800">Like</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    {replyingTo === c.id && (
                      <div className="flex items-center gap-2 mt-2 ml-2 pl-3 border-l-2 border-gray-200">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          {currentUser?.profilePicture ? (
                            <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">{currentUser?.firstName?.[0] || "?"}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-2">
                          <input
                            autoFocus
                            type="text"
                            placeholder={`Reply to ${c.name.split(" ")[0]}...`}
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && submitReply(c.id)}
                            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
                          />
                          <button onClick={() => submitReply(c.id)} className="text-[#1877F2]">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="me" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {currentUser?.firstName?.[0] || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitComment()}
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              <button onClick={submitComment} className="text-[#1877F2]">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}