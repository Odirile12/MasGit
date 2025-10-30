// 52_Masanabo
import React from "react";
import { MessageCircle, User, Clock } from "lucide-react";

const Messages = ({ messages }) => {
  // If you have actual check-in messages from the backend
  const checkinMessages = messages || [];

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <MessageCircle size={20} />
        Project Activity & Check-ins
      </h3>
      
      {checkinMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>No check-in activity yet</p>
          <p className="text-sm mt-1">Check out the project to start making changes!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkinMessages.map((message, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-700 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-400" />
                <span className="font-medium text-white">{message.username}</span>
                <span className="text-gray-400 text-sm">•</span>
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-400 text-sm">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-200 mb-2">{message.message}</p>
              {message.files && message.files.length > 0 && (
                <div className="text-sm text-blue-400">
                  Updated files: {message.files.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;