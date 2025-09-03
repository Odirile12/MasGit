import React, { useState } from 'react';
// import { User, Star, GitFork, Eye, ChevronDown } from 'lucide-react';
import { Link,BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";



const GitHubFeed = () => {
  const [sortBy, setSortBy] = useState('Recent');
  const [filter, setFilter] = useState('Local');

  // Mock data for the feed
  const projects = [
    {
      id: 1,
      name: "awesome-react-components",
      description: "A curated list of awesome React components and libraries for building modern web applications",
      author: "john_dev",
      avatar: "JD",
      language: "JavaScript",
      stars: 2847,
      forks: 234,
      watchers: 89,
      updatedAt: "2 hours ago",
      isPrivate: false
    },
    {
      id: 2,
      name: "machine-learning-toolkit",
      description: "Comprehensive toolkit for machine learning workflows with Python and TensorFlow integration",
      author: "ai_researcher",
      avatar: "AR",
      language: "Python",
      stars: 1523,
      forks: 156,
      watchers: 67,
      updatedAt: "5 hours ago",
      isPrivate: false
    },
    {
      id: 3,
      name: "design-system-ui",
      description: "Modern design system with reusable components built with TypeScript and Storybook",
      author: "design_team",
      avatar: "DT",
      language: "TypeScript",
      stars: 892,
      forks: 78,
      watchers: 45,
      updatedAt: "1 day ago",
      isPrivate: true
    },
    {
      id: 4,
      name: "mobile-app-starter",
      description: "Cross-platform mobile application starter template with React Native and Expo",
      author: "mobile_dev",
      avatar: "MD",
      language: "JavaScript",
      stars: 1246,
      forks: 203,
      watchers: 92,
      updatedAt: "3 days ago",
      isPrivate: false
    }
  ];

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-400',
      Python: 'bg-blue-500',
      TypeScript: 'bg-blue-600',
      CSS: 'bg-purple-500',
      HTML: 'bg-orange-500'
    };
    return colors[language] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Projects | Feed</h1>
          </div>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            {/* <User size={16} /> */}
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm transition-colors">
                <span>{filter}</span>
                {/* <ChevronDown size={14} /> */}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>SORT BY</span>
            <button className="text-white hover:text-gray-300 transition-colors">
              {sortBy}
            </button>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <main className="px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              {/* Project Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {project.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
                      {project.name}
                    </h3>
                    {project.isPrivate && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {project.description}
                  </p>
                  
                  {/* Project Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                      <span>{project.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* <Star size={14} /> */}
                      <span>{ }</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* <GitFork size={14} /> */}
                      <span>{ }</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* <Eye size={14} /> */}
                      <span>{project.watchers}</span>
                    </div>
                    <span>Updated {project.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-4">
                <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm transition-colors">
                  {/* <Star size={14} /> */}
                  <span>Star</span>
                </button>
                <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm transition-colors">
                  {/* <GitFork size={14} /> */}
                  {/* <span>Fork</span> */}
                </button>
                <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm transition-colors">
                  {/* <Eye size={14} /> */}
                  <span>Watch</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-md text-sm transition-colors">
            Load more projects
          </button>
        </div>
      </main>
    </div>
  );
};

export default GitHubFeed;