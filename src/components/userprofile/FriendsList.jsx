import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";
import { Users } from "lucide-react";

export default function FriendsList({ userId }) {
  const { getFriends, getUserById } = useFBAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // getFriends uses currentUser internally, so for other users
      // we fetch Friendship records by userId manually
      try {
        const { base44 } = await import("@/api/base44Client");
        const [f1, f2] = await Promise.all([
          base44.entities.Friendship.filter({ user1_id: userId }),
          base44.entities.Friendship.filter({ user2_id: userId }),
        ]);
        const friendIds = [...f1.map(f => f.user2_id), ...f2.map(f => f.user1_id)];
        const users = await Promise.all(friendIds.map(id => getUserById(id)));
        setFriends(users.filter(Boolean));
      } catch {
        setFriends([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white mt-2 px-4 py-6 flex justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1877F2] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base text-gray-900">Friends</h2>
        <span className="text-xs text-gray-400">{friends.length} friends</span>
      </div>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <Users className="w-10 h-10 text-gray-200 mb-2" />
          <p className="text-gray-400 text-sm">No friends to show yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {friends.map(friend => {
            const name = `${friend.firstName} ${friend.lastName}`;
            return (
              <button
                key={friend.id}
                onClick={() => navigate(`/user/${friend.id}`)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-200">
                  {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt={name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                  ) : (
                    <div className="w-full h-full bg-[#1877F2] flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{friend.firstName?.[0]}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2">{name}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}