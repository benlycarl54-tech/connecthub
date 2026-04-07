import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Heart, MessageCircle, Tag, Package, Share2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFBAuth } from "@/context/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";

const CONDITION_COLORS = {
  "New": "bg-green-100 text-green-700",
  "Like New": "bg-blue-100 text-blue-700",
  "Good": "bg-yellow-100 text-yellow-700",
  "Fair": "bg-orange-100 text-orange-700",
};

export default function MarketplaceDetail() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser, getUserById } = useFBAuth();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await base44.entities.Marketplace.get(listingId);
      if (data) {
        setListing(data);
        if (data.seller_id) {
          const sellerData = await getUserById(data.seller_id);
          setSeller(sellerData);
        }
      }
      setLoading(false);
    })();
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1877F2] rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col items-center justify-center gap-3">
        <p className="text-5xl">😕</p>
        <p className="font-bold text-gray-900">Item not found</p>
        <button onClick={() => navigate("/marketplace")} className="text-[#1877F2] text-sm font-semibold">
          Back to Marketplace
        </button>
      </div>
    );
  }

  const isSeller = currentUser?.id === listing.seller_id;

  const handleMessageSeller = () => {
    if (!seller) return;
    navigate("/messages", { state: { startChatWith: seller } });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 flex items-center justify-between px-3 py-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="font-bold text-gray-900">Item Details</h1>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-200 overflow-hidden">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">📦</div>
        )}
      </div>

      {/* Price & Title */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-3xl font-bold text-gray-900">${(listing.price || 0).toLocaleString()}</p>
          {listing.status !== "Available" && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
              {listing.status}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{listing.title}</h2>

        <div className="flex flex-wrap gap-2 mb-3">
          {listing.condition && (
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${CONDITION_COLORS[listing.condition] || "bg-gray-100 text-gray-600"}`}>
              <Package className="w-3 h-3" /> {listing.condition}
            </span>
          )}
          {listing.category && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              <Tag className="w-3 h-3" /> {listing.category}
            </span>
          )}
          {listing.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3" /> {listing.location}
            </span>
          )}
        </div>

        {listing.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
        )}
      </div>

      {/* Seller Info */}
      {seller && (
        <div className="bg-white mt-2 px-4 py-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Seller</p>
          <button
            onClick={() => navigate(`/user/${seller.id}`)}
            className="flex items-center gap-3 w-full"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1877F2] flex-shrink-0 flex items-center justify-center">
              {seller.profilePicture ? (
                <img src={seller.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">{seller.firstName?.[0] || "?"}</span>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-gray-900 text-sm">{seller.firstName} {seller.lastName}</p>
                {seller.is_verified && <VerifiedBadge size={14} />}
              </div>
              <p className="text-xs text-gray-500">Tap to view profile</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
        </div>
      )}

      {/* Action Button */}
      {!isSeller && listing.status === "Available" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={handleMessageSeller}
            className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-base active:bg-[#166FE5] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Message Seller
          </button>
        </div>
      )}

      {isSeller && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
          <p className="text-center text-sm text-gray-500 font-semibold">This is your listing</p>
        </div>
      )}
    </div>
  );
}