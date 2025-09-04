import React, { useState } from "react";

const EditProject = ({ project, onSave }) => {
  const [form, setForm] = useState(project);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
         Edit Project
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Project Title"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Project Description"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProject