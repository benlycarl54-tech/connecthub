import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/home/BottomTabBar";
import CreateListingModal from "@/components/marketplace/CreateListingModal";
import ProductCard from "@/components/marketplace/ProductCard";

const CATEGORIES = ["All", "Electronics", "Furniture", "Fashion", "Books", "Sports", "Home", "Vehicles", "Other"];

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { currentUser, getMarketplaceListings } = useFBAuth();
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const allListings = getMarketplaceListings();
    setListings(allListings);
  }, []);

  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isAvailable = item.status === "Available";
    return matchesCategory && matchesSearch && isAvailable;
  });

  const handleListingCreated = (newListing) => {
    setListings(prev => [newListing, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-9 h-9 bg-[#1877F2] rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-3 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Categories */}
        <div className="pb-3 relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 text-sm font-semibold text-gray-900"
          >
            {selectedCategory}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 w-48">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-50 text-[#1877F2] font-semibold"
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-100" />
      </div>

      {/* Listings */}
      <div className="px-4 py-4">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-3">🛍️</div>
            <p className="font-bold text-gray-900 mb-1">No items found</p>
            <p className="text-sm text-gray-500">Try a different search or category</p>
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
          onListingCreated={handleListingCreated}
        />
      )}

      <BottomTabBar />
    </div>
  );
}