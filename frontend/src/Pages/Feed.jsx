import React, { useState, useEffect } from 'react';
import { User, Home, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/header/header';
import ProjectList from '../components/Project/ProjectList';

const GitHubFeed = () => {
    const [projects, setProjects] = useState([]);
    const [sortBy, setSortBy] = useState('Recent');
    const [filter, setFilter] = useState('Local');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const getAuthToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    const handleGoToProfile = () => {
        navigate("/profile");
    };

    const fetchProjects = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                return;
            }

            const params = new URLSearchParams();
            
            if (filter) params.append('filter', filter);
            if (sortBy) params.append('sortBy', sortBy);
            if (searchQuery) params.append('search', searchQuery);
            
            const url = `http://localhost:5000/api/projects${params.toString() ? '?' + params.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const projectsData = await response.json();
            return projectsData;

        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadProjects = async () => {
            const result = await fetchProjects();
            setProjects(result || []);
        };
        
        const timeoutId = setTimeout(() => {
            loadProjects();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [sortBy, filter, searchQuery]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="min-h-screen dark:bg-gray-900 dark:text-white bg-white text-gray-900 backdrop-blur-sm">
            {/* Enhanced Header with Profile Navigation */}
            <div className="dark:bg-gray-800 bg-gray-100 border-b dark:border-gray-700 border-gray-300 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Left side - Brand/Title */}
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold dark:text-white text-gray-900">
                                CodeCollab Feed
                            </h1>
                        </div>

                        {/* Right side - Navigation Links */}
                        <div className="flex items-center gap-4">
                            {/* Home/Feed Link (current page) */}
                            <div className="flex items-center gap-2 px-3 py-2 dark:text-white text-gray-900 dark:bg-gray-700 bg-gray-200 rounded-md">
                                <Home size={18} />
                                <span>Feed</span>
                            </div>

                            {/* Profile Link */}
                            <button
                                onClick={handleGoToProfile}
                                className="flex items-center gap-2 px-3 py-2 dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <User size={18} />
                                <span>Profile</span>
                            </button>


                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 dark:text-gray-300 text-gray-600 dark:hover:text-red-400 hover:text-red-600 dark:hover:bg-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search Header */}
            <Header 
                name="Feed"
                sortBy={sortBy} 
                filter={filter} 
                onSortChange={setSortBy}
                onFilterChange={setFilter}
                onSearchChange={handleSearchChange}
                searchQuery={searchQuery}
            />
            
            <main className="px-6 py-6">
                <ProjectList projects={projects} />
            </main>
        </div>
    );
};

export default GitHubFeed;