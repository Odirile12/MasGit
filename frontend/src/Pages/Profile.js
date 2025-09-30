import React, { useState,useEffect  } from "react";
import { User, Edit3, Plus, Users } from "lucide-react";

import Friends from "../components/Profile/Friends";
import EditProfile from "../components/Profile/EditProfile";
import CreateProject from "../components/Profile/CreateProject";
import ProjectsList from "../components/Profile/ProjectsList";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    project:[]
  });

  const [projects, setProjects] = useState([
    { id: 1, name: "Student Portal", description: "React + Node.js app" },
    { id: 2, name: "ML Tool", description: "Machine learning toolkit" },
  ]);

  const [friends] = useState(["Sam", "Lerato", "Thabo", "Aisha"]);


const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAuthUserId = () => {
   let UserId=  localStorage.getItem('user') || sessionStorage.getItem('user');
    console.log(UserId)
    return JSON.parse(UserId);
  };
 
  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);


  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required');
        return;
      }
      const userId = getAuthUserId().id;
      if (!userId) {
        setError('User ID not found');
        return;
      }

      // Fetch user profile
      const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);
      setDetails(userData);

      // Fetch user activities
      const activitiesResponse = await fetch(`http://localhost:5000/api/activities/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
         return activitiesData;
      }
      else {
        throw new Error('Failed to fetch user activities');
      }

     

      // Get user's projects from the user data

    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const result = await fetchUserData();
      console.log("User Activities: ", result);
      setData(result);
    }
    loadUserData();
    
  }, []);

  useEffect(() => {
  if (details) {
    console.log("Updated User Details: ", details);
    setUser(details);
  }

}, [details]);
console.log("Profile User: ", user?.friends?.[0]);

  return (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <div className="flex flex-col md:flex-row gap-6">
    {console.log("project details"+JSON.stringify( details?.projects[0]))}
      <div className="flex-1 space-y-6">
        <Profile user={user} />
        <EditProfile user={user} onSave={setUser} />
      </div>

      <div className="flex-1 space-y-6">
        <ProjectsList projects={details?.projects} />

        
        <Friends friends={user?.friends} />
        <CreateProject
          onCreate={(newProject) =>
            setProjects([...projects, { ...newProject, id: Date.now() }])
          }
        />
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;
