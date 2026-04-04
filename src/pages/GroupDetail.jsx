import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, Settings, UserPlus, MessageSquare } from "lucide-react";
import { useFBAuth } from "@/context/AuthContext";
import PostCard from "@/components/post/PostCard";

import CreateGroupPostModal from "@/components/groups/CreateGroupPostModal";

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser, getGroupById, getGroupMembers, getGroupPosts, removeGroupMember } = useFBAuth();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);

  useEffect(() => {
    const groupData = getGroupById(groupId);
    if (groupData) {
      setGroup(groupData);
      setMembers(getGroupMembers(groupId));
      setPosts(getGroupPosts(groupId));
    }
  }, [groupId]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center max-w-md mx-auto">
        <p className="text-gray-500">Group not found</p>
      </div>
    );
  }

  const isOwner = group.owner_id === currentUser?.id;

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handleRemoveMember = (userId) => {
    removeGroupMember(groupId, userId);
    setMembers(prev => prev.filter(m => m.id !== userId));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/groups")} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{group.name}</h1>
        {isOwner && (
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Group Cover */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-6xl">{group.icon || "👥"}</span>
        </div>
        <div className="px-4 py-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{group.name}</h2>
          {group.description && (
            <p className="text-sm text-gray-600 mb-3">{group.description}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowMembersList(!showMembersList)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-200"
            >
              <Users className="w-4 h-4" />
              <span>{members.length} Members</span>
            </button>
            {isOwner && (
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-[#1877F2] font-semibold py-2 rounded-lg hover:bg-blue-100">
                <UserPlus className="w-4 h-4" />
                <span>Invite</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Members List */}
      {showMembersList && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <p className="font-semibold text-gray-900 mb-3">Members ({members.length})</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                      {member.profilePicture ? (
                        <img src={member.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">{member.firstName?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      {group.owner_id === member.id && (
                        <p className="text-xs text-gray-400">Owner</p>
                      )}
                    </div>
                  </div>
                  {isOwner && group.owner_id !== member.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-xs text-red-500 font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Post */}
      <div className="bg-white mt-2 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {currentUser?.profilePicture ? (
              <img src={currentUser.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{currentUser?.firstName?.[0]}</span>
            )}
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-left text-gray-400 text-sm border border-gray-200"
          >
            What's on your mind?
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-2">
        {posts.length === 0 ? (
          <div className="bg-white mx-2 rounded-lg p-8 flex flex-col items-center justify-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No posts yet</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              authorName={post.author_name}
              authorAvatar={post.author_avatar}
              authorId={post.author_id}
            />
          ))
        )}
      </div>

      {showCreatePost && (
        <CreateGroupPostModal
          groupId={groupId}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}