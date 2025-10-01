// import React, { useState } from "react";
// import { Link} from "react-router";
// import { User, Edit3, Plus, Users } from "lucide-react";


// const deleteProject=  async (projectId)=> {
//   const TOKEN=localStorage.getItem('token') || sessionStorage.getItem('token');
//   const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
//     method: 'DELETE',
//     headers: {
//       'Authorization': `Bearer ${TOKEN}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.json();
// }



// const ProjectsList = ({ projects }) => (

  
//   <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
//     <h3 className="text-lg font-semibold mb-4">Projects</h3>
//     <ul className="space-y-3">
//       {projects?.map((p,i) => (
//         <li key={i} className="bg-gray-700 p-3 rounded-md">
//           <h4 className="font-semibold text-blue-400">{p?.name || ''}</h4>
//           <p className="text-gray-400 text-sm">{p?.description || ''}</p>
//           <button onClick={() => deleteProject(p?._id)}>Delete</button>
//         </li>
//       ))}
//     </ul>
//   </div>
// );


// export default ProjectsList

import React, { useState } from "react";
import { Link } from "react-router";
import { User, Edit3, Plus, Users, Trash2 } from "lucide-react";

const ProjectsList = ({ projects, onProjectDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const deleteProject = async (projectId) => {
    const TOKEN = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    try {
      setDeletingId(projectId);
      
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Call the callback function to update the parent component
        if (onProjectDelete) {
          onProjectDelete(projectId);
          window.location.reload(); 
        }
      } else {
        console.error('Failed to delete project:', result.message);
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Projects</h3>
      <ul className="space-y-3">
        {projects?.map((p, i) => (
          <li key={i} className="bg-gray-700 p-3 rounded-md flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-400">{p?.name || ''}</h4>
              <p className="text-gray-400 text-sm">{p?.description || ''}</p>
            </div>
            <button
              onClick={() => handleDeleteClick(p?._id, p?.name)}
              disabled={deletingId === p?._id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${deletingId === p?._id 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                }
              `}
            >
              <Trash2 size={16} />
              {deletingId === p?._id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;