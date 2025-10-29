import React, { useState, useEffect, useRef } from 'react';
import { Search, User, FolderOpen, Hash } from 'lucide-react';

const SearchBar = ({ onSearchChange, searchQuery }) => {
    const [localQuery, setLocalQuery] = useState(searchQuery || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);

    // Update local state when searchQuery prop changes
    useEffect(() => {
        setLocalQuery(searchQuery || '');
    }, [searchQuery]);

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (localQuery.trim().length > 0) {
                await fetchSuggestions(localQuery.trim());
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localQuery]);

    const fetchSuggestions = async (query) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const [usersRes, projectsRes] = await Promise.all([
                fetch(`http://localhost:5000/api/users?search=${encodeURIComponent(query)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`http://localhost:5000/api/projects?search=${encodeURIComponent(query)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const users = usersRes.ok ? await usersRes.json() : [];
            const projects = projectsRes.ok ? await projectsRes.json() : [];

            const userSuggestions = users.slice(0, 3).map(user => ({
                type: 'user',
                id: user._id,
                text: `${user.name} (@${user.username})`,
                displayText: user.name,
                username: user.username,
                avatar: user.avatar
            }));

            const projectSuggestions = projects.slice(0, 3).map(project => ({
                type: 'project',
                id: project._id,
                text: project.name,
                description: project.description?.substring(0, 50) + (project.description?.length > 50 ? '...' : ''),
                hashtags: project.hashtags || []
            }));

            const hashtagSuggestions = [];
            projects.forEach(project => {
                if (project.hashtags) {
                    project.hashtags.forEach(tag => {
                        if (tag.toLowerCase().includes(query.toLowerCase()) && !hashtagSuggestions.find(h => h.text === tag)) {
                            hashtagSuggestions.push({
                                type: 'hashtag',
                                text: tag,
                                count: 1
                            });
                        }
                    });
                }
            });

            setSuggestions([...userSuggestions, ...projectSuggestions, ...hashtagSuggestions.slice(0, 2)]);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setLocalQuery(value);
        onSearchChange(value);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'user') {
            window.location.href = `/profile/${suggestion.id}`;
        } else if (suggestion.type === 'project') {
            window.location.href = `/project/${suggestion.id}`;
        } else if (suggestion.type === 'hashtag') {
            setLocalQuery(`#${suggestion.text}`);
            onSearchChange(`#${suggestion.text}`);
        }
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    const handleFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleBlur = (e) => {
        // Delay hiding suggestions to allow click events
        setTimeout(() => {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }, 150);
    };

    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'user': return <User size={16} className="text-blue-400" />;
            case 'project': return <FolderOpen size={16} className="text-green-400" />;
            case 'hashtag': return <Hash size={16} className="text-purple-400" />;
            default: return <Search size={16} className="text-gray-400" />;
        }
    };

    const renderSuggestion = (suggestion, index) => {
        const isSelected = index === selectedIndex;

        if (suggestion.type === 'user') {
            return (
                <div
                    key={`${suggestion.type}-${suggestion.id}`}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-600 transition-colors ${isSelected ? 'bg-gray-600' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                        <div className="font-medium text-white">{suggestion.displayText}</div>
                        <div className="text-sm text-gray-400">@{suggestion.username}</div>
                    </div>
                </div>
            );
        } else if (suggestion.type === 'project') {
            return (
                <div
                    key={`${suggestion.type}-${suggestion.id}`}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-600 transition-colors ${isSelected ? 'bg-gray-600' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                        <div className="font-medium text-white">{suggestion.text}</div>
                        {suggestion.description && (
                            <div className="text-sm text-gray-400">{suggestion.description}</div>
                        )}
                        {suggestion.hashtags && suggestion.hashtags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                                {suggestion.hashtags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        } else if (suggestion.type === 'hashtag') {
            return (
                <div
                    key={`${suggestion.type}-${suggestion.text}`}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-600 transition-colors ${isSelected ? 'bg-gray-600' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                        <div className="font-medium text-purple-300">#{suggestion.text}</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="relative " ref={searchRef}>
            <input
                type="text"
                value={localQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search users, projects, hashtags..."
                className="w-150 px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-200 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
