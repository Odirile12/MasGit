import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users } from "lucide-react";


const Friends = ({ friends }) => (
  
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Users size={16} /> Friends
    </h3>
    <div className="flex flex-wrap gap-3">
{!friends ? (
  <div>Loading friends...</div>
) : (
  friends.map((f, i) => (
    <div
      key={i}
      className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold"
    >
      {f.avatar || ''}
    </div>
  ))
)}
    </div>
  </div>
);



export default Friends