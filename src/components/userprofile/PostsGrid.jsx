import { useState } from "react";
import PostCard from "@/components/post/PostCard";
import { Grid, List } from "lucide-react";

export default function PostsGrid({ posts, user, fullName }) {
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"

  if (!posts.length) {
    return (
      <div className="bg-white mt-2 px-4 py-10 text-center">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-gray-500 text-sm font-medium">No posts yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle header */}
      <div className="bg-white mt-2 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <h2 className="font-bold text-base text-gray-900">Posts</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-400"}`}
          >
            <List className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-400"}`}
          >
            <Grid className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        // Photo/image grid
        <div className="bg-white mt-0 grid grid-cols-3 gap-0.5">
          {posts.map(post => {
            const thumb = post.image || post.videoThumb;
            return (
              <div key={post.id} className="aspect-square overflow-hidden bg-gray-100">
                {thumb ? (
                  <img src={thumb} alt="post" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center p-2">
                    <p className="text-xs text-gray-500 line-clamp-4 text-center">{post.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // List view
        <div>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              authorName={fullName}
              authorAvatar={user.profilePicture}
              authorVerified={user.is_verified}
              authorId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}