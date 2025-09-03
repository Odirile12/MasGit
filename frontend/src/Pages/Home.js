import React from "react";

import { Link,BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";

import { useState } from 'react';
import { User, Plus, BookOpen, Code, Database } from 'lucide-react';

const CourseFeed = () => {
  const [filter, setFilter] = useState('All Courses');

  // Mock data for courses
  const courses = [
    {
      id: 1,
      code: "COS 110",
      title: "Linked Lists & Recursion",
      description: "Topics include pointer manipulation, recursive function design, call and stack behavior.",
      tags: ["C++", "Recursion", "Stacks"],
      type: "course",
      hasNotes: true
    },
    {
      id: 2,
      code: "COS 212",
      title: "Polyphase Merge Sort",
      description: "A breakdown of external sorting, dummy runs, and merge pattern simulations",
      tags: ["Java", "Sorting"],
      type: "course",
      hasNotes: true
    },
    {
      id: 3,
      code: "IMY 210",
      title: "Introduction to Vue Js & Nuxt Js",
      description: "This introduces students to framework Vue Js, Vue is a frontend framework, whereas Nuxt Js is a backend framework.",
      tags: ["Vue", "Tailwind", "Nuxt"],
      type: "course",
      hasNotes: true
    },
    {
      id: 4,
      code: "Create Note",
      title: "Start a New Note",
      description: "Click below to create a blank note and start typing right away.",
      tags: [],
      type: "create",
      hasNotes: false
    }
  ];

  const getTagColor = (tag) => {
    const colors = {
      'C++': 'bg-blue-600',
      'Java': 'bg-orange-600',
      'Vue': 'bg-green-600',
      'JavaScript': 'bg-yellow-600',
      'Python': 'bg-blue-500',
      'Recursion': 'bg-purple-600',
      'Stacks': 'bg-indigo-600',
      'Sorting': 'bg-red-600',
      'Tailwind': 'bg-cyan-600',
      'Nuxt': 'bg-emerald-600'
    };
    return colors[tag] || 'bg-gray-600';
  };

  const getCourseIcon = (code) => {
    if (code.startsWith('COS')) return <Code size={16} className="text-blue-400" />;
    if (code.startsWith('IMY')) return <BookOpen size={16} className="text-green-400" />;
    if (code.startsWith('INF')) return <Database size={16} className="text-purple-400" />;
    return <BookOpen size={16} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Course Notes | <Link to ="/Feed" >Feed</Link></h1>
          </div>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">

            <User size={16} />
          </div>
        </div>

    
      {/* Filter Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Filter:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Informatics</option>
              <option>Recent</option>
            </select>
          </div>
        </div>
        </div>
        
      </header>

      {/* Course Grid */}
      <main className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 group"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  {course.type === 'create' ? (
                    <Plus size={16} className="text-gray-400" />
                  ) : (
                    getCourseIcon(course.code)
                  )}
                  <h3 className="font-semibold text-sm text-gray-300">
                    {course.code}
                  </h3>
                </div>
                <h2 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Tags */}
              {course.tags.length > 0 && (
                <div className="p-4 border-b border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`${getTagColor(tag)} text-white text-xs px-2 py-1 rounded font-medium`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="p-4">
                {course.type === 'create' ? (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Create</span>
                  </button>
                ) : (
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Open Notes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add More Courses Section */}
        <div className="mt-12 text-center">
          <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors">
            <Plus size={24} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Add New Course</h3>
            <p className="text-gray-500 text-sm mb-4">
              Import your course materials or create a new course from scratch
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Add Course
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseFeed;