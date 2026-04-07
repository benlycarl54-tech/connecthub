import { MapPin, Heart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ listing, onClick }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
        {listing.status !== "Available" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/60 px-2 py-1 rounded">{listing.status}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[#1877F2] font-bold text-base">${(listing.price || 0).toLocaleString()}</p>
        <h3 className="font-semibold text-gray-900 text-xs line-clamp-2 mt-0.5 leading-tight">{listing.title}</h3>
        {listing.location && (
          <div className="flex items-center gap-1 text-gray-400 mt-1">
            <MapPin className="w-2.5 h-2.5" />
            <span className="text-[10px] truncate">{listing.location}</span>
          </div>
        )}
        <span className="text-[10px] text-gray-400 mt-0.5 block">{listing.condition}</span>
      </div>
    </button>
  );
}