import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import CreateAlbumModal from "./CreateAlbumModal";
import AlbumCard from "./AlbumCard";

export default function GalleryTab({ userId }) {
  const { getUserAlbums } = useFBAuth();
  const [albums, setAlbums] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const userAlbums = getUserAlbums(userId);
    setAlbums(userAlbums);
  }, [userId]);

  const handleAlbumCreated = (newAlbum) => {
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-2 hover:shadow-md transition-shadow border border-gray-200"
      >
        <Plus className="w-5 h-5 text-[#1877F2]" />
        <span className="font-semibold text-[#1877F2]">Create Album</span>
      </button>

      {albums.length === 0 ? (
        <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No albums yet</p>
          <p className="text-gray-400 text-xs mt-1">Create an album to organize your photos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateAlbumModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onAlbumCreated={handleAlbumCreated}
        />
      )}
    </div>
  );
}