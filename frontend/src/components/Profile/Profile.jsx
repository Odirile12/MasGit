import React, { useState } from "react";
import { Link} from "react-router";


const Profile = ({ user }) => {
  // Generate random placeholder avatar if no image
  const getRandomAvatar = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    const colorIndex = user.name ? user.name.length % colors.length : Math.floor(Math.random() * colors.length);
    return { initials, color: colors[colorIndex] };
  };

  const avatarData = getRandomAvatar();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: avatarData.color }}
        >
          {user.avatar || avatarData.initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400">@{user.username}</p>
          <p className="text-gray-300 mt-2">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};
export default Profile
