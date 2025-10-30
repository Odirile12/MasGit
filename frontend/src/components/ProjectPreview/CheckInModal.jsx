import React, { useState } from "react";
import { X, Upload, MessageCircle } from "lucide-react";

const CheckInModal = ({ project, isOpen, onClose, onCheckIn }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please provide a check-in message');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Upload files first if any
      const uploadedFiles = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const uploadResponse = await fetch(
          `http://localhost:5000/api/projects/${project._id}/files/upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData
          }
        );

        if (!uploadResponse.ok) throw new Error('Failed to upload files');
        
        const uploadData = await uploadResponse.json();
        uploadedFiles.push(...uploadData.files);
      }

      // Then check in the project
      const checkinResponse = await fetch(
        `http://localhost:5000/api/projects/${project._id}/checkin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            files: uploadedFiles
          })
        }
      );

      if (!checkinResponse.ok) throw new Error('Failed to check in project');

      alert('Project checked in successfully!');
      onCheckIn();
      onClose();
      
      // Reset form
      setMessage("");
      setFiles([]);
      
    } catch (error) {
      console.error('Error during check-in:', error);
      alert('Failed to check in project: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Check In Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Info */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Project: {project.title}</h3>
            <p className="text-gray-300 text-sm">
              Describe the changes you've made and upload any new files.
            </p>
          </div>

          {/* Check-in Message */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <MessageCircle size={16} />
              Check-in Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you've worked on, changes made, or any important updates..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Upload size={16} />
              Upload New Files (Optional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-400">
                {files.length} file(s) selected
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Checking In...' : 'Check In Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;