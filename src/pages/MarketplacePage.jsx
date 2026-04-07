import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useFBAuth } from "@/context/AuthContext";
import CreateListingModal from "@/components/marketplace/CreateListingModal";
import ProductCard from "@/components/marketplace/ProductCard";

const CATEGORIES = ["All", "Electronics", "Furniture", "Fashion", "Books", "Sports", "Home", "Vehicles", "Other"];

const CATEGORY_ICONS = {
  All: "🛍️", Electronics: "📱", Furniture: "🪑", Fashion: "👗",
  Books: "📚", Sports: "⚽", Home: "🏠", Vehicles: "🚗", Other: "📦",
};

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { currentUser } = useFBAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    const all = await base44.entities.Marketplace.list("-created_date", 100);
    setListings(all);
    setLoading(false);
  };

  useEffect(() => { loadListings(); }, []);

  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (item.title || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch && item.status === "Available";
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button onClick={() => navigate("/home")} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900">Marketplace</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-[#1877F2] text-white text-sm font-semibold px-3 py-2 rounded-full"
          >
            <Plus className="w-4 h-4" /> Sell
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category pills scroll */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-[#1877F2] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span> {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-3 py-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="font-bold text-gray-900 mb-1">No items found</p>
            <p className="text-sm text-gray-500 mb-4">Try a different search or category</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1877F2] text-white font-semibold px-5 py-2.5 rounded-full text-sm"
            >
              Be the first to sell!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredListings.map(listing => (
              <ProductCard
                key={listing.id}
                listing={listing}
                onClick={() => navigate(`/marketplace/${listing.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateListingModal
          onClose={() => setShowCreateModal(false)}
          onListingCreated={() => { loadListings(); setShowCreateModal(false); }}
        />
      )}
    </div>
  );
}