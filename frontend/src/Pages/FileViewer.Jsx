// 52_Masanabo
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Edit, 
  X, 
  FileText, 
  Code,
  Copy,
  Check,
  Home,
  User
} from "lucide-react";

const FileViewer = () => {
  const { projectId, filename } = useParams();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  const decodedFilename = decodeURIComponent(filename);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Add navigation functions
  const handleGoToFeed = () => {
    navigate("/Feed");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchFileContent();
    fetchProjectDetails();
  }, [projectId, filename]);

  const fetchProjectDetails = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch project');

      const data = await response.json();
      setProject(data);

      // Check permissions
      const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const isOwner = data.owner && data.owner._id === userData._id;
        const isMember = data.members && data.members.some(m => m._id === userData._id);
        setCanEdit(isOwner || isMember);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  const fetchFileContent = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/${decodedFilename}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to load file');

      const data = await response.json();
      setFileContent(data.content);
      setOriginalContent(data.content);
    } catch (err) {
      console.error('Error loading file:', err);
      alert('Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getAuthToken();

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/${decodedFilename}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: fileContent })
        }
      );

      if (!response.ok) throw new Error('Failed to save file');

      setOriginalContent(fileContent);
      setIsEditing(false);
      alert('File saved successfully!');
    } catch (err) {
      console.error('Error saving file:', err);
      alert('Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/files/${decodedFilename}/download`,
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
      a.download = decodedFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    setFileContent(originalContent);
    setIsEditing(false);
  };

  const getLanguageFromFilename = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'txt': 'text'
    };
    return langMap[ext] || 'text';
  };

  const hasChanges = fileContent !== originalContent;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading file...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoToFeed}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <Home size={18} />
                <span>Feed</span>
              </button>
              
              <button
                onClick={handleGoToProfile}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <User size={18} />
                <span>Profile</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          {/* File Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <ArrowLeft size={20} />
              Back to Project
            </button>
            
            <div className="flex items-center gap-2">
              {canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-md flex items-center gap-2 transition"
                >
                  <Edit size={16} />
                  Edit File
                </button>
              )}
              
              {isEditing && (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md flex items-center gap-2 transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}

              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center gap-2 transition"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Code size={24} className="text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">{decodedFilename}</h1>
              {project && (
                <p className="text-sm text-gray-400">
                  Project: {project.title}
                </p>
              )}
            </div>
          </div>

          {isEditing && hasChanges && (
            <div className="mt-3 px-3 py-2 bg-yellow-900/30 border border-yellow-700 rounded-md text-sm text-yellow-300">
              You have unsaved changes
            </div>
          )}
        </div>
      </div>




      {/* File Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-600">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FileText size={16} />
              <span>{getLanguageFromFilename(decodedFilename)}</span>
            </div>
            <div className="text-xs text-gray-400">
              {fileContent.split('\n').length} lines
            </div>
          </div>

          <div className="p-0">
            {isEditing ? (
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full min-h-[600px] px-4 py-3 bg-gray-800 text-white font-mono text-sm focus:outline-none resize-none"
                style={{ 
                  tabSize: 2,
                  lineHeight: '1.6'
                }}
                spellCheck={false}
              />
            ) : (
              <pre className="w-full min-h-[600px] px-4 py-3 bg-gray-800 text-white font-mono text-sm overflow-x-auto">
                <code style={{ lineHeight: '1.6' }}>
                  {fileContent || '(empty file)'}
                </code>
              </pre>
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">File Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">File Name:</span>
              <span className="ml-2 text-white">{decodedFilename}</span>
            </div>
            <div>
              <span className="text-gray-400">Size:</span>
              <span className="ml-2 text-white">
                {(new Blob([fileContent]).size / 1024).toFixed(2)} KB
              </span>
            </div>
            <div>
              <span className="text-gray-400">Lines:</span>
              <span className="ml-2 text-white">{fileContent.split('\n').length}</span>
            </div>
            <div>
              <span className="text-gray-400">Characters:</span>
              <span className="ml-2 text-white">{fileContent.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;