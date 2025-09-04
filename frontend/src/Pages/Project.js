import React, { useState } from "react";
import Nevigat from "../components/header/Nav";
import { Link } from "react-router";

import Project from "../components/ProjectPreview/Projects"
import EditProject from "../components/ProjectPreview/EditProject"
import Messages from "../components/ProjectPreview/Messages"
import Files from "../components/ProjectPreview/Files"


const ProjectPage = () => {
  const [project, setProject] = useState({
    title: "Drone Delivery System",
    description:
      "A system for real-time drone package delivery using GPS tracking.",
    owner: "Nkosinathi M.",
    status: "Active",
  });

  const files = [
    { name: "index.js", type: "JavaScript" },
    { name: "App.vue", type: "Vue" },
    { name: "db.sql", type: "Database Schema" },
  ];

  const messages = [
    { text: "Checked in main branch with bug fixes.", user: "Alice" },
    { text: "Checked out db.sql for updates.", user: "Bob" },
    { text: "Merged feature branch into main.", user: "Nkosinathi" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="px-6 py-4 flex flex-col items-center gap-3">
        <Nevigat 
          name="Project"
          lik={<Link to="/Feed" className="text-gray-300 hover:text-white font-medium transition-colors">Feed</Link>}>
        </Nevigat>
      </header>

      <main className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="space-y-6 lg:col-span-1">
            <Project project={project} />
            <EditProject project={project} onSave={setProject} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Files files={files} />
            <Messages messages={messages} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
