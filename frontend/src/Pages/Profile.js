import React, { useState } from "react";
import { User, Edit3, Plus, Users } from "lucide-react";

import Friends from "../components/Profile/Friends";
import EditProfile from "../components/Profile/EditProfile";
import CreateProject from "../components/Profile/CreateProject";
import ProjectsList from "../components/Profile/ProjectsList";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    username: "alexj_dev",
    bio: "Computer Science student passionate about full-stack dev.",
    avatar: "AJ",
  });

  const [projects, setProjects] = useState([
    { id: 1, name: "Student Portal", description: "React + Node.js app" },
    { id: 2, name: "ML Tool", description: "Machine learning toolkit" },
  ]);

  const [friends] = useState(["Sam", "Lerato", "Thabo", "Aisha"]);

  return (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <div className="flex flex-col md:flex-row gap-6">

      <div className="flex-1 space-y-6">
        <Profile user={user} />
        <EditProfile user={user} onSave={setUser} />
      </div>

      <div className="flex-1 space-y-6">
        <ProjectsList projects={projects} />

        
        <Friends friends={friends} />
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
