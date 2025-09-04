import React, { useState } from "react";
import { User, Edit3, Plus, Users } from "lucide-react";

// ✅ Profile Component
const Profile = ({ user }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
        {user.avatar}
      </div>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="text-gray-300 mt-2">{user.bio}</p>
      </div>
    </div>
  </div>
);

// ✅ Edit Profile Component
const EditProfile = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Edit3 size={16} /> Edit Profile
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}
        className="space-y-3"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-white font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// ✅ Projects List Component
const ProjectsList = ({ projects }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">Projects</h3>
    <ul className="space-y-3">
      {projects.map((p) => (
        <li key={p.id} className="bg-gray-700 p-3 rounded-md">
          <h4 className="font-semibold text-blue-400">{p.name}</h4>
          <p className="text-gray-400 text-sm">{p.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

// ✅ Friends Component
const Friends = ({ friends }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Users size={16} /> Friends
    </h3>
    <div className="flex flex-wrap gap-3">
      {friends.map((f, i) => (
        <div
          key={i}
          className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold"
        >
          {f[0]}
        </div>
      ))}
    </div>
  </div>
);

// ✅ Create Project Component
const CreateProject = ({ onCreate }) => {
  const [project, setProject] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(project);
    setProject({ name: "", description: "" });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus size={16} /> Create Project
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Project Name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium"
        >
          Add Project
        </button>
      </form>
    </div>
  );
};

// ✅ Main Profile Page
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
    {/* Left column */}
    <div className="flex-1 space-y-6">
      <Profile user={user} />
      <EditProfile user={user} onSave={setUser} />
    </div>

    {/* Right column */}
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
