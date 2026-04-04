import { MapPin, Heart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ listing, onClick }) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow text-left"
    >
      <div className="relative w-full h-40 bg-gray-200 overflow-hidden group">
        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{listing.title}</h3>
        <p className="text-[#1877F2] font-bold text-lg mb-2">
          ${listing.price.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span>{listing.location}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {listing.condition} • {listing.category}
        </div>
      </div>
    </button>
  );
}