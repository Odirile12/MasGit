// 52_Masanabo
import React, { useState } from "react";
import { Link } from "react-router";
import { User, Edit3, Plus, Users, UserPlus, Check, X, UserMinus } from "lucide-react";

const Friends = ({ friends, friendRequests, onAcceptRequest, onRejectRequest, onRemoveFriend }) => {
  const [showRequests, setShowRequests] = useState(false);
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const receivedRequests = friendRequests?.received || [];
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users size={16} /> Friends
        </h3>
        
        {receivedRequests.length > 0 && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
          >
            <UserPlus size={14} />
            {receivedRequests.length} Request{receivedRequests.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Friend Requests Section */}
      {showRequests && receivedRequests.length > 0 && (
        <div className="mb-4 space-y-2 pb-4 border-b border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Pending Requests</h4>
          {receivedRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {request.avatar || request.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{request.name || request.username}</p>
                  <p className="text-xs text-gray-400">@{request.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAcceptRequest(request._id)}
                  className="p-1.5 bg-green-600 hover:bg-green-700 rounded transition"
                  title="Accept"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => onRejectRequest(request._id)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition"
                  title="Reject"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div className="flex flex-wrap gap-3">
        {!friends ? (
          <div className="text-gray-400 text-sm">Loading friends...</div>
        ) : friends.length === 0 ? (
          <div className="text-gray-400 text-sm">No friends yet</div>
        ) : (
friends.map((f) => (
  <div key={f._id} className="relative group">
    <Link to={`/profile/${f._id}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
        {f.avatar || f.username?.charAt(0).toUpperCase() || 'U'}
      </div>
    </Link>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {f.name || f.username}
    </div>
    <button
      onClick={() => onRemoveFriend(f._id)}
      className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      title="Remove Friend"
    >
      <UserMinus size={14} />
    </button>
  </div>
))
        )}
      </div>
    </div>
  );
};

export default Friends;