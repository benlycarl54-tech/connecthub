import { useState } from "react";
import { Play, ThumbsUp, MessageSquare, Share2, Volume2, VolumeX, ChevronLeft, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/home/BottomTabBar";
import { useFBAuth } from "../context/AuthContext";

const VIDEOS = [
  { id: 1, title: "Funny moment 😂", author: "James Williams", authorBg: "bg-blue-500", time: "2h", likes: 1240, comments: 87, shares: 45, views: "12K", thumb: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, title: "Amazing dance moves 🕺", author: "Patricia Mensah", authorBg: "bg-pink-500", time: "4h", likes: 3580, comments: 213, shares: 120, views: "45K", thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 3, title: "Nature beauty 🌿", author: "Kevin Osei", authorBg: "bg-teal-500", time: "6h", likes: 890, comments: 42, shares: 18, views: "8.2K", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 4, title: "Cooking masterclass 👨‍🍳", author: "Linda Asante", authorBg: "bg-orange-400", time: "1d", likes: 2100, comments: 156, shares: 89, views: "23K", thumb: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 5, title: "Viral prank 🤣", author: "David Boateng", authorBg: "bg-green-500", time: "1d", likes: 5400, comments: 344, shares: 278, views: "89K", thumb: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 6, title: "Street food tour 🍜", author: "Ngozi Darko", authorBg: "bg-red-400", time: "2d", likes: 1760, comments: 98, shares: 55, views: "19K", thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 7, title: "Morning workout 💪", author: "Emmanuel Kwame", authorBg: "bg-yellow-500", time: "2d", likes: 3200, comments: 189, shares: 143, views: "38K", thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 8, title: "Baby's first steps 👶", author: "Ama Mensah", authorBg: "bg-purple-400", time: "3d", likes: 8900, comments: 521, shares: 412, views: "134K", thumb: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 9, title: "Epic sunset 🌅", author: "Kwame Johnson", authorBg: "bg-indigo-500", time: "3d", likes: 4300, comments: 267, shares: 198, views: "62K", thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 10, title: "Music jam session 🎵", author: "Fatima Al-Hassan", authorBg: "bg-rose-400", time: "4d", likes: 2780, comments: 134, shares: 76, views: "31K", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 11, title: "Cute cats compilation 🐱", author: "James Williams", authorBg: "bg-blue-500", time: "4d", likes: 12400, comments: 892, shares: 743, views: "256K", thumb: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 12, title: "Travel vlog: Paris 🗼", author: "Patricia Mensah", authorBg: "bg-pink-500", time: "5d", likes: 6700, comments: 398, shares: 287, views: "94K", thumb: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 13, title: "DIY home decor 🏠", author: "Kevin Osei", authorBg: "bg-teal-500", time: "5d", likes: 1890, comments: 112, shares: 68, views: "22K", thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 14, title: "Fishing adventure 🎣", author: "Linda Asante", authorBg: "bg-orange-400", time: "6d", likes: 920, comments: 54, shares: 23, views: "11K", thumb: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 15, title: "Football highlights ⚽", author: "David Boateng", authorBg: "bg-green-500", time: "1w", likes: 9800, comments: 634, shares: 512, views: "178K", thumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 16, title: "Fashion lookbook 👗", author: "Ngozi Darko", authorBg: "bg-red-400", time: "1w", likes: 4120, comments: 276, shares: 198, views: "57K", thumb: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 17, title: "Magic tricks revealed ✨", author: "Emmanuel Kwame", authorBg: "bg-yellow-500", time: "1w", likes: 7650, comments: 445, shares: 367, views: "112K", thumb: "https://images.unsplash.com/photo-1543285198-3af15c4592ce?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 18, title: "Rain forest walk 🌳", author: "Ama Mensah", authorBg: "bg-purple-400", time: "1w", likes: 3400, comments: 187, shares: 134, views: "43K", thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 19, title: "Kids birthday party 🎂", author: "Kwame Johnson", authorBg: "bg-indigo-500", time: "2w", likes: 5600, comments: 312, shares: 245, views: "78K", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 20, title: "Ocean diving 🤿", author: "Fatima Al-Hassan", authorBg: "bg-rose-400", time: "2w", likes: 4890, comments: 298, shares: 213, views: "69K", thumb: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 21, title: "Gym transformation 🏋️", author: "James Williams", authorBg: "bg-blue-500", time: "2w", likes: 11200, comments: 734, shares: 621, views: "198K", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 22, title: "Sunrise hike ⛰️", author: "Patricia Mensah", authorBg: "bg-pink-500", time: "3w", likes: 2300, comments: 143, shares: 98, views: "28K", thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 23, title: "Night market food 🍱", author: "Kevin Osei", authorBg: "bg-teal-500", time: "3w", likes: 3760, comments: 224, shares: 167, views: "51K", thumb: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 24, title: "Skydiving experience 🪂", author: "Linda Asante", authorBg: "bg-orange-400", time: "3w", likes: 8700, comments: 567, shares: 478, views: "156K", thumb: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 25, title: "Art painting tutorial 🎨", author: "David Boateng", authorBg: "bg-green-500", time: "4w", likes: 1560, comments: 89, shares: 56, views: "18K", thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 26, title: "Roller skating fun ⛸️", author: "Ngozi Darko", authorBg: "bg-red-400", time: "4w", likes: 2890, comments: 178, shares: 123, views: "37K", thumb: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 27, title: "Dog tricks 🐕", author: "Emmanuel Kwame", authorBg: "bg-yellow-500", time: "1mo", likes: 15600, comments: 1023, shares: 876, views: "312K", thumb: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 28, title: "Underwater photography 📸", author: "Ama Mensah", authorBg: "bg-purple-400", time: "1mo", likes: 5400, comments: 321, shares: 245, views: "81K", thumb: "https://images.unsplash.com/photo-1551244072-5d12893278bc?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 29, title: "Garden planting 🌱", author: "Kwame Johnson", authorBg: "bg-indigo-500", time: "1mo", likes: 1230, comments: 76, shares: 43, views: "14K", thumb: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 30, title: "Sunset drive 🚗", author: "Fatima Al-Hassan", authorBg: "bg-rose-400", time: "1mo", likes: 3900, comments: 234, shares: 178, views: "54K", thumb: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 31, title: "House party vibes 🎉", author: "James Williams", authorBg: "bg-blue-500", time: "2mo", likes: 6700, comments: 412, shares: 334, views: "97K", thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 32, title: "Street basketball 🏀", author: "Patricia Mensah", authorBg: "bg-pink-500", time: "2mo", likes: 7800, comments: 489, shares: 398, views: "124K", thumb: "https://images.unsplash.com/photo-1546519638405-a9f7d5202a2a?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 33, title: "Baking bread 🍞", author: "Kevin Osei", authorBg: "bg-teal-500", time: "2mo", likes: 2100, comments: 132, shares: 87, views: "26K", thumb: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 34, title: "City night lights 🌃", author: "Linda Asante", authorBg: "bg-orange-400", time: "2mo", likes: 4500, comments: 287, shares: 213, views: "64K", thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 35, title: "Yoga morning routine 🧘", author: "David Boateng", authorBg: "bg-green-500", time: "3mo", likes: 3300, comments: 198, shares: 145, views: "47K", thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 36, title: "Extreme sports 🏂", author: "Ngozi Darko", authorBg: "bg-red-400", time: "3mo", likes: 9800, comments: 634, shares: 543, views: "187K", thumb: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 37, title: "Family reunion 👨‍👩‍👧‍👦", author: "Emmanuel Kwame", authorBg: "bg-yellow-500", time: "3mo", likes: 5600, comments: 345, shares: 278, views: "82K", thumb: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 38, title: "Market day shopping 🛒", author: "Ama Mensah", authorBg: "bg-purple-400", time: "3mo", likes: 1450, comments: 89, shares: 56, views: "17K", thumb: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 39, title: "Reading in the park 📚", author: "Kwame Johnson", authorBg: "bg-indigo-500", time: "4mo", likes: 2300, comments: 145, shares: 98, views: "29K", thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 40, title: "DIY electronics ⚡", author: "Fatima Al-Hassan", authorBg: "bg-rose-400", time: "4mo", likes: 3450, comments: 212, shares: 167, views: "48K", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 41, title: "Coffee making art ☕", author: "James Williams", authorBg: "bg-blue-500", time: "4mo", likes: 4200, comments: 256, shares: 198, views: "61K", thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 42, title: "Surfing waves 🏄", author: "Patricia Mensah", authorBg: "bg-pink-500", time: "5mo", likes: 7600, comments: 478, shares: 389, views: "118K", thumb: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 43, title: "Karaoke night 🎤", author: "Kevin Osei", authorBg: "bg-teal-500", time: "5mo", likes: 3800, comments: 234, shares: 178, views: "53K", thumb: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 44, title: "Science experiment 🔬", author: "Linda Asante", authorBg: "bg-orange-400", time: "5mo", likes: 2100, comments: 134, shares: 89, views: "28K", thumb: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 45, title: "Mountain biking 🚴", author: "David Boateng", authorBg: "bg-green-500", time: "6mo", likes: 5700, comments: 356, shares: 287, views: "85K", thumb: "https://images.unsplash.com/photo-1544191696-102dbeb9df88?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 46, title: "Pottery making 🏺", author: "Ngozi Darko", authorBg: "bg-red-400", time: "6mo", likes: 3200, comments: 198, shares: 145, views: "44K", thumb: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 47, title: "Wildlife safari 🦁", author: "Emmanuel Kwame", authorBg: "bg-yellow-500", time: "6mo", likes: 9200, comments: 587, shares: 478, views: "167K", thumb: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 48, title: "Swimming competition 🏊", author: "Ama Mensah", authorBg: "bg-purple-400", time: "7mo", likes: 4500, comments: 278, shares: 213, views: "65K", thumb: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 49, title: "Chess tournament ♟️", author: "Kwame Johnson", authorBg: "bg-indigo-500", time: "7mo", likes: 1890, comments: 112, shares: 78, views: "24K", thumb: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 50, title: "Graduation day 🎓", author: "Fatima Al-Hassan", authorBg: "bg-rose-400", time: "8mo", likes: 13400, comments: 876, shares: 734, views: "234K", thumb: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop", src: "https://www.w3schools.com/html/movie.mp4" },
];

function VideoPlayer({ video, onClose }) {
  const { currentUser } = useFBAuth();
  const [muted, setMuted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, name: "James W.", text: "This is amazing! 🔥", time: "2h", bg: "bg-blue-500" },
    { id: 2, name: "Patricia M.", text: "Love this so much ❤️", time: "3h", bg: "bg-pink-400" },
  ]);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [showComments, setShowComments] = useState(false);

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(),
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() : "You",
      text: comment.trim(),
      time: "Just now",
      bg: "bg-[#1877F2]",
      avatar: currentUser?.profilePicture,
    }]);
    setComment("");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col max-w-md mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/80">
        <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{video.title}</p>
          <p className="text-white/60 text-xs">{video.author}</p>
        </div>
        <button onClick={() => setMuted(m => !m)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center bg-black">
        <video src={video.src} autoPlay controls muted={muted} className="w-full" style={{ maxHeight: "60vh", objectFit: "contain" }} />
      </div>

      {/* Actions */}
      <div className="bg-black/90 px-4 py-2">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-white/60 text-xs">{likes.toLocaleString()} reactions · {video.comments} comments</span>
        </div>
        <div className="flex border-t border-white/10 pt-2">
          <button onClick={() => { setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLoved(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg ${liked ? "text-[#1877F2]" : "text-white/70"}`}>
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-semibold">Like</span>
          </button>
          <button onClick={() => { setLoved(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLiked(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg ${loved ? "text-red-400" : "text-white/70"}`}>
            <span className="text-lg">❤️</span>
            <span className="text-sm font-semibold">Love</span>
          </button>
          <button onClick={() => setShowComments(s => !s)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white/70">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white/70">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-2 border-t border-white/10 pt-2 max-h-48 overflow-y-auto space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" alt="" /> : <span className="text-white text-xs font-bold">{c.name[0]}</span>}
                </div>
                <div className="bg-white/10 rounded-2xl px-3 py-1.5 flex-1">
                  <p className="text-white text-xs font-semibold">{c.name}</p>
                  <p className="text-white/80 text-xs">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        <div className="flex items-center gap-2 mt-2 pb-1">
          <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
            {currentUser?.profilePicture
              ? <img src={currentUser.profilePicture} className="w-full h-full object-cover rounded-full" alt="" />
              : <span className="text-white text-xs font-bold">{currentUser?.firstName?.[0] || "Y"}</span>}
          </div>
          <div className="flex-1 flex items-center bg-white/10 rounded-full px-3 py-2 gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
            />
            <button onClick={submitComment}><Send className="w-4 h-4 text-white/60" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }) {
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  return (
    <div className="bg-white mb-2 shadow-sm">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className={`w-10 h-10 rounded-full ${video.authorBg} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{video.author[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{video.author}</p>
          <p className="text-xs text-gray-400">{video.time} · 🌐</p>
        </div>
      </div>
      <p className="px-4 pb-2 text-sm text-gray-900 font-medium">{video.title}</p>

      <div className="relative cursor-pointer" onClick={() => onPlay(video)}>
        <img src={video.thumb} alt={video.title} className="w-full object-cover" style={{ maxHeight: 200 }} onError={e => { e.target.style.display = "none"; }} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
          <span className="text-white text-xs font-semibold">{video.views} views</span>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm">👍 ❤️</span>
          <span className="text-xs text-gray-500 ml-1">{likes.toLocaleString()}</span>
        </div>
        <span className="text-xs text-gray-500">{video.comments} comments · {video.shares} shares</span>
      </div>
      <div className="mx-4 border-t border-gray-100" />
      <div className="flex px-1 py-1">
        <button onClick={() => { setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLoved(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 ${liked ? "text-[#1877F2]" : "text-gray-500"}`}>
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm font-semibold">Like</span>
        </button>
        <button onClick={() => { setLoved(p => { setLikes(l => l + (p ? -1 : 1)); return !p; }); setLiked(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 ${loved ? "text-red-500" : "text-gray-500"}`}>
          <span className="text-lg">❤️</span>
          <span className="text-sm font-semibold">Love</span>
        </button>
        <button onClick={() => onPlay(video)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {playingVideo && <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}

      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Videos</h1>
        </div>
        <div className="flex border-b border-gray-100">
          {["foryou", "following", "reels"].map((t, i) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === t ? "text-[#1877F2] border-b-2 border-[#1877F2]" : "text-gray-400"}`}>
              {["For You", "Following", "Reels"][i]}
            </button>
          ))}
        </div>
      </div>

      {VIDEOS.map(v => (
        <VideoCard key={v.id} video={v} onPlay={setPlayingVideo} />
      ))}

      <BottomTabBar />
    </div>
  );
}