// 52_Masanabo
import React, { useState } from 'react';
import { User, Star, GitFork, Eye, Download, ExternalLink, Calendar, MapPin, Code, FileText, Image, Folder, ChevronRight, Play, Settings } from 'lucide-react';

const ProjectPreview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isStarred, setIsStarred] = useState(false);
  const [isWatching, setIsWatching] = useState(true);

  const projectData = {
    name: "student-portal-app",
    description: "A comprehensive full-stack student management system built with React, Node.js, and MongoDB. Features include course enrollment, grade tracking, assignment submission, and real-time communication between students and instructors.",
    owner: "alexj_dev",
    avatar: "AJ",
    language: "JavaScript",
    stars: 234,
    forks: 67,
    watchers: 89,
    size: "15.2 MB",
    license: "MIT",
    lastUpdate: "2 days ago",
    created: "September 2023",
    topics: ["react", "nodejs", "mongodb", "education", "fullstack", "javascript"],
    isPrivate: false,
    liveDemo: "https://student-portal-demo.com",
    issues: 12,
    pullRequests: 3
  };

  // Mock file structure
  const fileStructure = [
    { name: "src", type: "folder", children: [
      { name: "components", type: "folder" },
      { name: "pages", type: "folder" },
      { name: "hooks", type: "folder" },
      { name: "utils", type: "folder" },
      { name: "App.js", type: "file" },
      { name: "index.js", type: "file" }
    ]},
    { name: "public", type: "folder" },
    { name: "server", type: "folder", children: [
      { name: "models", type: "folder" },
      { name: "routes", type: "folder" },
      { name: "middleware", type: "folder" },
      { name: "server.js", type: "file" }
    ]},
    { name: "README.md", type: "file" },
    { name: "package.json", type: "file" },
    { name: ".gitignore", type: "file" }
  ];

  // Mock recent commits
  const recentCommits = [
    {
      id: 1,
      message: "Add user authentication and authorization system",
      author: "alexj_dev",
      date: "2 hours ago",
      hash: "a3b4c5d"
    },
    {
      id: 2,
      message: "Implement course enrollment functionality",
      author: "alexj_dev", 
      date: "1 day ago",
      hash: "x1y2z3w"
    },
    {
      id: 3,
      message: "Fix responsive design issues on mobile devices",
      author: "alexj_dev",
      date: "3 days ago",
      hash: "m7n8o9p"
    },
    {
      id: 4,
      message: "Add grade calculation and reporting features",
      author: "alexj_dev",
      date: "1 week ago",
      hash: "q4r5s6t"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FileText size={16} /> },
    { id: 'files', label: 'Files', icon: <Folder size={16} /> },
    { id: 'commits', label: 'Commits', icon: <Code size={16} /> },
    { id: 'preview', label: 'Live Preview', icon: <Play size={16} /> }
  ];

  const getFileIcon = (type, name) => {
    if (type === 'folder') return <Folder size={14} className="text-green-400" />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <Code size={14} className="text-yellow-400" />;
    if (name.endsWith('.md')) return <FileText size={14} className="text-blue-400" />;
    if (name.endsWith('.json')) return <Settings size={14} className="text-orange-400" />;
    return <FileText size={14} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top triangles */}
        <div className="absolute top-0 left-1/4 w-28 h-28 opacity-15">
          <div className="w-0 h-0 border-l-28 border-r-28 border-b-28 border-l-transparent border-r-green-400 border-b-green-400 transform rotate-45"></div>
        </div>
        <div className="absolute top-20 right-10 w-20 h-20 opacity-20">
          <div className="w-0 h-0 border-l-20 border-r-20 border-b-20 border-l-green-300 border-r-transparent border-b-green-300 transform -rotate-30"></div>
        </div>
        
        {/* Middle triangles */}
        <div className="absolute top-1/3 left-10 w-32 h-32 opacity-10">
          <div className="w-0 h-0 border-l-32 border-r-32 border-b-32 border-l-green-500 border-r-transparent border-b-green-500 transform rotate-90"></div>
        </div>
        
        {/* Bottom triangles */}
        <div className="absolute bottom-20 right-1/4 w-36 h-36 opacity-25">
          <div className="w-0 h-0 border-l-36 border-r-36 border-b-36 border-l-transparent border-r-green-400 border-b-green-400 transform -rotate-60"></div>
        </div>
        <div className="absolute bottom-40 left-20 w-24 h-24 opacity-15">
          <div className="w-0 h-0 border-l-24 border-r-24 border-b-24 border-l-green-300 border-r-transparent border-b-green-300 transform rotate-120"></div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-900 border-b border-green-900/30 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-green-400">Project Preview</h1>
          </div>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="bg-gray-900 border-b border-green-900/30 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Project Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-xl font-bold text-black">
                <Code size={24} />
              </div>
              
              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{projectData.name}</h1>
                  {projectData.isPrivate && (
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-green-900/30">
                      Private
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4 max-w-3xl leading-relaxed">
                  {projectData.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span>{projectData.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={14} />
                    <span>{projectData.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork size={14} />
                    <span>{projectData.forks}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{projectData.watchers}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Updated {projectData.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsStarred(!isStarred)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isStarred ? 'bg-green-600 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
                <span>{isStarred ? 'Starred' : 'Star'}</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-white">
                <GitFork size={16} />
                <span>Fork</span>
              </button>
              
              <button 
                onClick={() => setIsWatching(!isWatching)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isWatching ? 'bg-green-600 text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <Eye size={16} />
                <span>{isWatching ? 'Watching' : 'Watch'}</span>
              </button>

              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-black">
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Topics */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {projectData.topics.map((topic, index) => (
                <span
                  key={index}
                  className="bg-green-600 text-black text-xs px-2 py-1 rounded font-medium hover:bg-green-500 cursor-pointer transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-green-900/30 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* README Preview */}
              <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-400 mb-4">README.md</h2>
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-white">Student Portal App</h1>
                  <p className="text-gray-300">
                    A modern, responsive student management system designed to streamline educational workflows.
                  </p>
                  
                  <h2 className="text-green-400 mt-6 mb-3">Features</h2>
                  <ul className="text-gray-300 space-y-1">
                    <li>• User authentication and authorization</li>
                    <li>• Course enrollment and management</li>
                    <li>• Assignment submission and tracking</li>
                    <li>• Grade calculation and reporting</li>
                    <li>• Real-time messaging system</li>
                    <li>• Responsive mobile-first design</li>
                  </ul>

                  <h2 className="text-green-400 mt-6 mb-3">Technologies Used</h2>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Frontend: React.js, Tailwind CSS</li>
                    <li>• Backend: Node.js, Express.js</li>
                    <li>• Database: MongoDB</li>
                    <li>• Authentication: JWT</li>
                  </ul>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-400 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentCommits.slice(0, 3).map((commit) => (
                    <div key={commit.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{commit.message}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                          <span>{commit.author}</span>
                          <span>•</span>
                          <span>{commit.date}</span>
                          <span>•</span>
                          <span className="font-mono text-green-400">{commit.hash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Stats */}
              <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Project Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language</span>
                    <span className="text-white">{projectData.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size</span>
                    <span className="text-white">{projectData.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">License</span>
                    <span className="text-white">{projectData.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">{projectData.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Issues</span>
                    <span className="text-green-400">{projectData.issues} open</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pull Requests</span>
                    <span className="text-green-400">{projectData.pullRequests} open</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-md text-sm transition-colors">
                    <span className="text-white">View Live Demo</span>
                    <ExternalLink size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-md text-sm transition-colors">
                    <span className="text-white">Clone Repository</span>
                    <Download size={16} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-md text-sm transition-colors">
                    <span className="text-white">Report Issue</span>
                    <ExternalLink size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Contributors */}
              <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Contributors</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {projectData.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium">{projectData.owner}</div>
                    <div className="text-xs text-gray-400">Owner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-gray-900 border border-green-900/30 rounded-lg">
            <div className="p-4 border-b border-green-900/30">
              <h2 className="text-lg font-semibold text-green-400">Project Files</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {fileStructure.map((item, index) => (
                  <div key={index} className="hover:bg-gray-800 rounded p-2 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(item.type, item.name)}
                      <span className="text-white">{item.name}</span>
                      {item.type === 'folder' && <ChevronRight size={14} className="text-gray-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="bg-gray-900 border border-green-900/30 rounded-lg">
            <div className="p-4 border-b border-green-900/30">
              <h2 className="text-lg font-semibold text-green-400">Recent Commits</h2>
            </div>
            <div className="divide-y divide-green-900/30">
              {recentCommits.map((commit) => (
                <div key={commit.id} className="p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-black">
                      {projectData.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{commit.message}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span>{commit.author}</span>
                        <span>committed {commit.date}</span>
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-green-400">{commit.hash}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="bg-gray-900 border border-green-900/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-400">Live Preview</h2>
              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-black">
                <ExternalLink size={16} />
                <span>Open in New Tab</span>
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Play size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Demo</h3>
              <p className="text-gray-400 mb-6">
                Experience the full functionality of the Student Portal App in our live demo environment.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-black font-medium py-3 px-6 rounded-md transition-colors">
                Launch Demo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectPreview;