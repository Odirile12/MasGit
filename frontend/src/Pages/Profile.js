import { Link,BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";


import React, { useState } from 'react';
import { User, MapPin, Calendar, Mail, BookOpen, Code, Award, Settings, Edit3, Star, GitFork, Eye, Activity } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    username: "alexj_dev",
    email: "alex.johnson@university.edu",
    location: "Johannesburg, South Africa",
    joinDate: "September 2023",
    bio: "Computer Science student passionate about full-stack development and machine learning. Currently exploring React, Vue.js, and Python frameworks.",
    avatar: "AJ",
    stats: {
      courses: 12,
      projects: 8,
      notes: 47,
      contributions: 124
    }
  };

  // Mock recent projects
  const recentProjects = [
    {
      id: 1,
      name: "student-portal-app",
      description: "Full-stack student management system built with React and Node.js",
      language: "JavaScript",
      stars: 23,
      forks: 5,
      updatedAt: "2 days ago",
      isPrivate: false
    },
    {
      id: 2,
      name: "ml-classification-tool",
      description: "Machine learning classification tool using Python and scikit-learn",
      language: "Python",
      stars: 15,
      forks: 3,
      updatedAt: "1 week ago",
      isPrivate: false
    },
    {
      id: 3,
      name: "vue-notes-app",
      description: "Note-taking application built with Vue.js and Tailwind CSS",
      language: "Vue",
      stars: 8,
      forks: 2,
      updatedAt: "2 weeks ago",
      isPrivate: true
    }
  ];

  // Mock recent courses
  const recentCourses = [
    {
      code: "COS 110",
      title: "Linked Lists & Recursion",
      progress: 85,
      lastAccessed: "Today"
    },
    {
      code: "COS 212",
      title: "Data Structures & Algorithms",
      progress: 92,
      lastAccessed: "Yesterday"
    },
    {
      code: "IMY 210",
      title: "Web Development Frameworks",
      progress: 78,
      lastAccessed: "3 days ago"
    }
  ];

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      Python: 'bg-blue-500',
      Vue: 'bg-green-500',
      TypeScript: 'bg-blue-600',
      CSS: 'bg-purple-500'
    };
    return colors[language] || 'bg-gray-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={16} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={16} /> },
    { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm transition-colors">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {userData.avatar}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <span className="text-gray-400 text-lg">@{userData.username}</span>
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1">
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
              </div>
              
              <p className="text-gray-300 mb-4 max-w-2xl">
                {userData.bio}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail size={14} />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userData.stats.courses}</div>
              <div className="text-sm text-gray-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{userData.stats.projects}</div>
              <div className="text-sm text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{userData.stats.notes}</div>
              <div className="text-sm text-gray-400">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{userData.stats.contributions}</div>
              <div className="text-sm text-gray-400">Contributions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
              {recentProjects.map((project) => (
                <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
                      {project.name}
                    </h3>
                    {project.isPrivate && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                        <span>{project.language}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={12} />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork size={12} />
                        <span>{project.forks}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{project.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Courses */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
              {recentCourses.map((course, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-400">{course.code}</span>
                      <span className="text-gray-600">•</span>
                      <h3 className="font-semibold text-white">{course.title}</h3>
                    </div>
                    <span className="text-xs text-gray-500">{course.lastAccessed}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs text-gray-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    Continue Learning →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                      <span>{project.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={12} />
                      <span>{project.stars}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{project.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen size={16} className="text-blue-400" />
                  <span className="font-semibold text-blue-400">{course.code}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{course.title}</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">First Repository</h3>
              <p className="text-gray-400 text-sm">Created your first project repository</p>
              <span className="text-xs text-gray-500 mt-2 block">Earned 2 weeks ago</span>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Code Contributor</h3>
              <p className="text-gray-400 text-sm">Made 50+ contributions across projects</p>
              <span className="text-xs text-gray-500 mt-2 block">Earned 1 week ago</span>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Course Master</h3>
              <p className="text-gray-400 text-sm">Completed 10+ courses with excellent grades</p>
              <span className="text-xs text-gray-500 mt-2 block">Earned 3 days ago</span>
            </div>
          </div>
        )}
      </main>

      {/* Activity Feed (Always visible at bottom) */}
      <div className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-2 mb-6">
            <Activity size={20} className="text-gray-400" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Completed assignment for</span>
              <span className="text-blue-400 font-medium">COS 110</span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Pushed commits to</span>
              <span className="text-blue-400 font-medium">student-portal-app</span>
              <span className="text-gray-500">5 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Started new course</span>
              <span className="text-blue-400 font-medium">IMY 320</span>
              <span className="text-gray-500">1 day ago</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Earned achievement</span>
              <span className="text-blue-400 font-medium">Course Master</span>
              <span className="text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;