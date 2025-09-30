import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users } from "lucide-react";


const ProjectsList = ({ projects }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">Projects</h3>
    <ul className="space-y-3">
      {projects?.map((p,i) => (
        <li key={i} className="bg-gray-700 p-3 rounded-md">
          <h4 className="font-semibold text-blue-400">{p?.name || ''}</h4>
          <p className="text-gray-400 text-sm">{p?.description || ''}</p>
        </li>
      ))}
    </ul>
  </div>
);


export default ProjectsList