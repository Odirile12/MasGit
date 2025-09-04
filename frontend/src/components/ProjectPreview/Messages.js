import React, { useState } from "react";

const Messages = ({ messages }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
       Check-in / Check-out Messages
    </h3>
    <ul className="space-y-3">
      {messages.map((msg, idx) => (
        <li key={idx} className="p-3 rounded-lg bg-gray-700">
          <p className="text-gray-200">{msg.text}</p>
          <span className="text-xs text-gray-400">— {msg.user}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Messages