// import React, { useState } from "react";

// const EditProject = ({ project, onSave }) => {
//   const [form, setForm] = useState(project);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
//       <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
//          Edit Project
//       </h3>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSave(form);
//         }}
//         className="space-y-4"
//       >
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//           placeholder="Project Title"
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//           placeholder="Project Description"
//         />
//         <select
//           name="status"
//           value={form.status}
//           onChange={handleChange}
//           className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//         >
//           <option>Active</option>
//           <option>On Hold</option>
//           <option>Completed</option>
//         </select>
//         <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProject

import React, { useState } from "react";
import { Edit3, CheckCircle, Clock } from "lucide-react";
import CheckInModal from "./CheckInModal"; // You'll need to create this

const EditProject = ({ project, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title || project.name,
    description: project.description,
    language: project.language,
    type: project.type,
    hashtags: project.hashtags?.join(', ') || '',
    isPrivate: project.isPrivate
  });

  const isCheckedOut = project.checkedOutBy && project.checkedOutBy._id;
  
  // You'll need to get current user ID from context
  const currentUserId = "current-user-id"; // Replace with actual current user ID
  const isCheckedOutByCurrentUser = isCheckedOut && project.checkedOutBy._id === currentUserId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update project');

      const updatedProject = await response.json();
      onSave(updatedProject);
      setIsEditing(false);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleCheckInSuccess = () => {
    window.location.reload(); // Refresh to show updated status
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Edit3 size={20} />
            Project Management
          </h3>
          
          {isCheckedOutByCurrentUser && (
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center gap-2 transition"
            >
              <CheckCircle size={16} />
              Check In
            </button>
          )}
        </div>

        {/* Check-out Status */}
        {isCheckedOut && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-yellow-400" />
              <span className="text-yellow-300 font-medium">Checked Out</span>
              <span className="text-gray-300">by {project.checkedOutBy.name}</span>
            </div>
            {isCheckedOutByCurrentUser && (
              <p className="text-green-300 text-sm mt-1">
                You have this project checked out. Don't forget to check in when you're done!
              </p>
            )}
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Your existing form fields */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isCheckedOut && !isCheckedOutByCurrentUser}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckedOut && !isCheckedOutByCurrentUser 
              ? 'Project is checked out - editing disabled'
              : 'Edit Project Details'
            }
          </button>
        )}
      </div>

      {/* Check-in Modal */}
      <CheckInModal
        project={project}
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onCheckIn={handleCheckInSuccess}
      />
    </>
  );
};

export default EditProject;