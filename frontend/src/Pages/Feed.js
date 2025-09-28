import React, { useState } from 'react';
import { User} from 'lucide-react';
import { Link} from "react-router";
import Header from '../components/header/header';
import ProjectList from '../components/Project/ProjectList';
import { useEffect } from 'react';
// import LoadMoreButton from './LoadMoreButton';



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

      const queryParams = new URLSearchParams({
        filter: filter,
        sortBy: sortBy
      });

      const response = await fetch(`http://localhost:5000/api/projects?${queryParams}`, {
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
      // console.log("Projects Data: ", projectsData);
      return projectsData;

    } catch (error) {
      console.error('Error fetching projects:', error);

    }
  };
useEffect(() => {
  const loadProjects = async () => {
    const result = await fetchProjects();
    setProjects(result);
  };
  loadProjects();
}, []);

console.log("Projects: ", projects);


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
	  {/* <ProjectPreview key={p.id} project={p} /> */}
        {/* <ProjectList key={p.id} projects={projects} /> */}
				<ProjectList  projects={projects} />
       
      </main>
    </div>
	);
};

export default GitHubFeed;