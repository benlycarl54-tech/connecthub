import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X, Trash2 } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/home/BottomTabBar";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { currentUser, getAlbumById, getAlbumPhotos, addPhotoToAlbum, removePhotoFromAlbum } = useFBAuth();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const albumData = getAlbumById(albumId);
    if (albumData) {
      setAlbum(albumData);
      setPhotos(getAlbumPhotos(albumId));
    }
  }, [albumId]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === "string") {
        const newPhoto = addPhotoToAlbum(albumId, {
          url: base64,
          uploaded_at: new Date().toISOString(),
        });

        if (newPhoto) {
          setPhotos(prev => [newPhoto, ...prev]);
          setAlbum(prev => ({ ...prev, photo_count: prev.photo_count + 1 }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (photoId) => {
    removePhotoFromAlbum(albumId, photoId);
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    setAlbum(prev => ({ ...prev, photo_count: Math.max(0, prev.photo_count - 1) }));
    setSelectedPhotos(prev => {
      const updated = new Set(prev);
      updated.delete(photoId);
      return updated;
    });
  };

  const handleSelectPhoto = (photoId) => {
    const updated = new Set(selectedPhotos);
    if (updated.has(photoId)) {
      updated.delete(photoId);
    } else {
      updated.add(photoId);
    }
    setSelectedPhotos(updated);
  };

  const isOwner = album?.user_id === currentUser?.id;

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center max-w-md mx-auto">
        <p className="text-gray-500">Album not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/profile")} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900">{album.title}</h1>
          <p className="text-xs text-gray-500">{album.photo_count} photos</p>
        </div>
        {isOwner && selectedPhotos.size > 0 && (
          <button
            onClick={() => {
              selectedPhotos.forEach(id => handleDeletePhoto(id));
              setSelectedPhotos(new Set());
            }}
            className="w-8 h-8 flex items-center justify-center text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        {!isOwner && <div className="w-8" />}
      </div>

      {/* Album Info */}
      <div className="bg-white mx-2 rounded-lg p-4 mt-2">
        <h2 className="font-bold text-gray-900">{album.title}</h2>
        {album.description && (
          <p className="text-sm text-gray-600 mt-1">{album.description}</p>
        )}
      </div>

      {/* Upload Button (Owner Only) */}
      {isOwner && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mx-2 mt-2 w-full bg-[#1877F2] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#166FE5]"
        >
          <Plus className="w-4 h-4" />
          Add Photos
        </button>
      )}

      {/* Photos Grid */}
      <div className="px-2 py-4">
        {photos.length === 0 ? (
          <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm">No photos in this album yet</p>
            {isOwner && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-[#1877F2] font-semibold text-sm"
              >
                Upload your first photo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="relative group cursor-pointer bg-gray-200 rounded-lg overflow-hidden aspect-square"
                onClick={() => isOwner && handleSelectPhoto(photo.id)}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                {isOwner && (
                  <>
                    <div className={`absolute inset-0 ${selectedPhotos.has(photo.id) ? "bg-blue-500/40" : "bg-black/0 group-hover:bg-black/20"} transition-colors`} />
                    {selectedPhotos.has(photo.id) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <BottomTabBar />
    </div>
  );
}