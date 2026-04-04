import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

export default function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/album/${album.id}`)}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {album.cover_photo ? (
        <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
          <img src={album.cover_photo} alt={album.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <p className="absolute bottom-2 left-2 text-white text-xs font-semibold">{album.photo_count} photos</p>
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <div className="p-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{album.title}</h3>
        {album.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{album.description}</p>
        )}
      </div>
    </button>
  );
}