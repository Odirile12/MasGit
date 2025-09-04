import React, { useState } from "react";

const Files = ({ files }) => {
    return(
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
       Files
    </h3>
    <ul className="space-y-2">
      {files.map((file, idx) => (
        <li
          key={idx}
          className="flex justify-between items-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          <span>{file.name}</span>
          <span className="text-xs text-gray-400">{file.type}</span>
        </li>
      ))}
    </ul>
  </div>)
};


export default Files