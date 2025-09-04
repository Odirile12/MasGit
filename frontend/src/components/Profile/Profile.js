import React, { useState } from "react";
import { Link} from "react-router";


const Profile = ({ user }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
        {user.avatar}
      </div>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="text-gray-300 mt-2">{user.bio}</p>
      </div>
    </div>
  </div>
);
export default Profile