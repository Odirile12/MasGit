import React, { useState } from "react";
import Nevigat from "../components/header/Nav";
import { Link } from "react-router";
import { useParams } from "react-router";

import Project from "../components/ProjectPreview/Projects"
import EditProject from "../components/ProjectPreview/EditProject"
import Messages from "../components/ProjectPreview/Messages"
import Files from "../components/ProjectPreview/Files"


const ProjectPage = () => {
  const { id } = useParams();
  

  const [project, setProject] = useState([
  {
    title: "awesome-react-components",
    description: "A curated list of awesome React components and libraries for building modern web applications",
    owner: "john_dev",
    status: "Active",
  },
  {
    title: "machine-learning-toolkit",
    description: "Comprehensive toolkit for machine learning workflows with Python and TensorFlow integration",
    owner: "ai_researcher",
    status: "Active",
  },
  {
    title: "design-system-ui",
    description: "Modern design system with reusable components built with TypeScript and Storybook",
    owner: "design_team",
    status: "Private",
  },
  {
    title: "mobile-app-starter",
    description: "Cross-platform mobile application starter template with React Native and Expo",
    owner: "mobile_dev",
    status: "Active",
  },
]
);

  const files = [
  [
    { name: "components.js", type: "JavaScript" },
    { name: "README.md", type: "Documentation" },
    { name: "package.json", type: "Config" },
  ],
  [
    { name: "model.py", type: "Python" },
    { name: "requirements.txt", type: "Config" },
    { name: "data.csv", type: "Dataset" },
  ],
  [
    { name: "Button.tsx", type: "TypeScript" },
    { name: "theme.css", type: "CSS" },
    { name: "storybook.config.js", type: "Config" },
  ],
  [
    { name: "App.js", type: "JavaScript" },
    { name: "expo.config.js", type: "Config" },
    { name: "assets/logo.png", type: "Image" },
  ],
];


  const messages = [
  [
    { text: "Added new carousel component.", user: "john_dev" },
    { text: "Updated README with usage examples.", user: "Alice" },
    { text: "Fixed prop validation warnings.", user: "Bob" },
  ],
  [
    { text: "Refactored training loop for efficiency.", user: "ai_researcher" },
    { text: "Uploaded new dataset for testing.", user: "Thabo" },
    { text: "Improved accuracy by 3%.", user: "Zanele" },
  ],
  [
    { text: "Added dark mode support.", user: "design_team" },
    { text: "Reviewed typography guidelines.", user: "Alice" },
    { text: "Merged layout fixes into main.", user: "Bob" },
  ],
  [
    { text: "Initialized Expo project.", user: "mobile_dev" },
    { text: "Added splash screen assets.", user: "Thabo" },
    { text: "Fixed navigation bug on Android.", user: "Zanele" },
  ],
];

const index = Math.min(parseInt(id, 10), project.length - 1)-1;


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
            <Project project={project[index]} />
            <EditProject project={project[index]} onSave={setProject} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Files files={files[index]} />
            <Messages messages={messages[index]} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
