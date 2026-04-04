import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function StoryViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const stories = location.state?.stories || [];
  const startIndex = location.state?.startIndex || 0;
  const [current, setCurrent] = useState(startIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (current < stories.length - 1) setCurrent(c => c + 1);
          else navigate(-1);
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current]);

  if (!stories.length) return null;
  const story = stories[current];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center max-w-md mx-auto">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-20">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-none rounded-full"
              style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Author info */}
      <div className="absolute top-6 left-0 right-0 flex items-center gap-3 px-4 z-20">
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-gray-500 flex-shrink-0">
          {story.img ? (
            <img src={story.img} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full ${story.bg || "bg-blue-500"} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{story.name?.[0]}</span>
            </div>
          )}
        </div>
        <span className="text-white font-semibold text-sm">{story.name}</span>
        <span className="text-white/60 text-xs">{story.time || "now"}</span>
      </div>

      {/* Close */}
      <button onClick={() => navigate(-1)} className="absolute top-6 right-4 z-20 w-8 h-8 flex items-center justify-center">
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Story content */}
      <div className="w-full h-full relative">
        {story.img ? (
          <img src={story.img} alt="" className="w-full h-full object-cover" />
        ) : story.content ? (
          <div className={`w-full h-full flex items-center justify-center ${story.bg || "bg-gradient-to-br from-purple-500 to-blue-600"}`}>
            <p className="text-white text-2xl font-bold text-center px-8">{story.content}</p>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
      </div>

      {/* Nav taps */}
      <button
        className="absolute left-0 top-0 w-1/3 h-full z-10"
        onClick={() => { if (current > 0) setCurrent(c => c - 1); else navigate(-1); }}
      />
      <button
        className="absolute right-0 top-0 w-1/3 h-full z-10"
        onClick={() => { if (current < stories.length - 1) setCurrent(c => c + 1); else navigate(-1); }}
      />
    </div>
  );
}