// 52_Masanabo

import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Plus, Download, Edit, Trash2, FileText, Code, File } from "lucide-react";

const Files = ({ files, projectId, isOwner, isMember }) => {
  const navigate = useNavigate();
  const [uploadMode, setUploadMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'css', 'html', 'json'];
    
    if (codeExtensions.includes(ext)) {
      return <Code size={16} className="text-blue-400" />;
    }
    return <FileText size={16} className="text-gray-400" />;
  };

  const handleFileClick = (file) => {
    navigate(`/project/${projectId}/file/${encodeURIComponent(file.name)}`);
  };

  const handleDownloadFile = async (file, e) => {
    e.stopPropagation();
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/${file.name}/download`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to download file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file');
    }
  };

  const handleDeleteFile = async (fileName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/${fileName}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete file');

      alert('File deleted successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      setLoading(true);
      const token = getAuthToken();
      const formData = new FormData();

      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/upload`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to upload files');

      alert('Files uploaded successfully!');
      setUploadMode(false);
      setSelectedFiles(null);
      window.location.reload();
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

const handleCreateFile = async () => {
  if (!newFileName.trim()) {
    alert('Please enter a filename');
    return;
  }

  try {
    setLoading(true);
    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:5000/api/projects/${projectId}/files`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: newFileName,
          content: newFileContent || '' // Ensure content is always defined
        })
      }
    );

    const data = await response.json(); // Parse response JSON

    if (!response.ok) {
      // Use backend error message if available
      throw new Error(data.message || 'Failed to create file');
    }

    alert('File created successfully!');
    setCreateMode(false);
    setNewFileName('');
    setNewFileContent('');
    window.location.reload();
  } catch (err) {
    console.error('Error creating file:', err);
    alert(err.message); // Show specific error message from backend
  } finally {
    setLoading(false);
  }
};

  const canEdit = isOwner || isMember;

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <FileText size={20} /> Files
        </h3>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => setCreateMode(!createMode)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-sm flex items-center gap-1 transition"
              disabled={loading}
            >
              <Plus size={14} /> New File
            </button>
            <button
              onClick={() => setUploadMode(!uploadMode)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-sm flex items-center gap-1 transition"
              disabled={loading}
            >
              <Upload size={14} /> Upload
            </button>
          </div>
        )}
      </div>

      {/* Create File Form */}
      {createMode && canEdit && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold mb-3 text-white">Create New File</h4>
          <input
            type="text"
            placeholder="filename.js"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-md bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Initial file content (optional)"
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 mb-3 rounded-md bg-gray-600 text-white font-mono text-sm border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateFile}
              disabled={loading || !newFileName.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus size={14} /> Create File
            </button>
            <button
              onClick={() => {
                setCreateMode(false);
                setNewFileName('');
                setNewFileContent('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Files Form */}
      {uploadMode && canEdit && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold mb-3 text-white">Upload Files</h4>
          <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 mb-3 hover:border-purple-500 transition">
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-500 file:cursor-pointer"
              id="file-upload-input"
            />
          </div>
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mb-3 p-2 bg-gray-600 rounded text-sm text-gray-300">
              {selectedFiles.length} file(s) selected
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleUploadFiles}
              disabled={!selectedFiles || loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Upload size={14} /> Upload Files
            </button>
            <button
              onClick={() => {
                setUploadMode(false);
                setSelectedFiles(null);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="space-y-2">
        {files && files.length > 0 ? (
          files.map((file, idx) => (
            <div
              key={idx}
              onClick={() => handleFileClick(file)}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2 flex-1">
                {getFileIcon(file.name)}
                <span className="text-white group-hover:text-blue-400 transition">
                  {file.name}
                </span>
                {file.size && (
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDownloadFile(file, e)}
                  className="p-1.5 hover:bg-gray-500 rounded transition"
                  title="Download"
                >
                  <Download size={16} className="text-green-400" />
                </button>
                {canEdit && (
                  <button
                    onClick={(e) => handleDeleteFile(file.name, e)}
                    className="p-1.5 hover:bg-red-600 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <File size={48} className="mx-auto mb-2 opacity-50" />
            <p>No files yet</p>
            {canEdit && (
              <p className="text-sm mt-1">Create or upload files to get started</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;