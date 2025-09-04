import React, { useState } from "react";
import { Link} from "react-router";
import { User, Edit3, Plus, Users } from "lucide-react";


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


export default EditProfile