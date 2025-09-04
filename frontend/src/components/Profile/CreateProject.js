import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users } from "lucide-react";


const CreateProject = ({ onCreate }) => {
  const [project, setProject] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(project);
    setProject({ name: "", description: "" });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus size={16} /> Create Project
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Project Name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium"
        >
          Add Project
        </button>
      </form>
    </div>
  );
};



export default CreateProject