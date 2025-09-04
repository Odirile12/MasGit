import React, { useState } from 'react';
import { User} from 'lucide-react';
import { Link} from "react-router";
import Header from '../components/header/header';
import ProjectList from '../components/Project/ProjectList';
// import LoadMoreButton from './LoadMoreButton';



const GitHubFeed = () => {
	const [sortBy, setSortBy] = useState('Recent');
	const [filter, setFilter] = useState('Local');

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
        {/* <LoadMoreButton /> */}
      </main>
    </div>
	);
};

export default GitHubFeed;