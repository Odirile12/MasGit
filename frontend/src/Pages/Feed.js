import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Link } from "react-router";
import Header from '../components/header/header';
import ProjectList from '../components/Project/ProjectList';

const GitHubFeed = () => {
    const [projects, setProjects] = useState([]);
    const [sortBy, setSortBy] = useState('Recent');
    const [filter, setFilter] = useState('Local');

    const getAuthToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
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

    // Refetch projects whenever sortBy or filter changes
    useEffect(() => {
        const loadProjects = async () => {
            const result = await fetchProjects();
            setProjects(result || []);
        };
        loadProjects();
    }, [sortBy, filter]); // Added dependencies here

    return (
        <div className="min-h-screen bg-gray-900 backdrop-blur-sm text-white">
            <Header 
                name="Feed"
                sortBy={sortBy} 
                filter={filter} 
                onSortChange={setSortBy}
                onFilterChange={setFilter}
            />
            
            
            <main className="px-6 py-6">
                <ProjectList projects={projects} />
            </main>
        </div>
    );
};

export default GitHubFeed;