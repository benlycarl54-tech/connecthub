import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, Users, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFBAuth } from "@/context/AuthContext";

import CreateGroupModal from "@/components/groups/CreateGroupModal";

export default function GroupsPage() {
  const navigate = useNavigate();
  const { currentUser, getGroupsByUser, getGroupMembers } = useFBAuth();
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser?.id) {
      const userGroups = getGroupsByUser(currentUser.id);
      setGroups(userGroups);
    }
  }, [currentUser?.id]);

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupCreated = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")} className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Groups</h1>
          </div>
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
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="border-t border-gray-100" />
      </div>

      {/* Groups List */}
      <div className="px-4 py-4">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 mb-1">No groups yet</p>
            <p className="text-sm text-gray-500 text-center mb-4">Create or join a group to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1877F2] text-white font-semibold px-6 py-2 rounded-full text-sm"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => navigate(`/group/${group.id}`)}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{group.icon || "👥"}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    {group.privacy === "private" ? (
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{group.members_count} members</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Open</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}