import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Heart, MessageCircle } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/home/BottomTabBar";

export default function MarketplaceDetail() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser, getMarketplaceListingById, getUserById, createDirectMessage } = useFBAuth();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const listingData = getMarketplaceListingById(listingId);
    if (listingData) {
      setListing(listingData);
      const sellerData = getUserById(listingData.seller_id);
      setSeller(sellerData);
    }
  }, [listingId]);

  if (!listing || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center max-w-md mx-auto">
        <p className="text-gray-500">Item not found</p>
      </div>
    );
  }

  const handleMessageSeller = () => {
    if (!currentUser) return;
    const conversation = createDirectMessage(currentUser.id, seller.id);
    navigate(`/messages?conversation=${conversation.id}`);
  };

  const isSeller = currentUser?.id === seller.id;

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Item Details</h1>
        <button
          onClick={() => setLiked(!liked)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Image */}
      <div className="w-full h-64 bg-gray-200 overflow-hidden">
        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
      </div>

      {/* Item Details */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">${listing.price.toLocaleString()}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{listing.condition} • {listing.category}</p>
          </div>
          {listing.status !== "Available" && (
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {listing.status}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>

        <div className="flex items-center gap-1 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{listing.location}</span>
        </div>

        {listing.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}
      </div>

      {/* Seller Info */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Seller</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {seller.profilePicture ? (
              <img src={seller.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{seller.firstName?.[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{seller.firstName} {seller.lastName}</p>
            <p className="text-xs text-gray-500">Member since 2024</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isSeller && listing.status === "Available" && (
        <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-gray-200">
          <button
            onClick={handleMessageSeller}
            className="w-full bg-[#1877F2] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#166FE5]"
          >
            <MessageCircle className="w-5 h-5" />
            Message Seller
          </button>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}