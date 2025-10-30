import ProjectCard from './projectCard';
import { Link} from "react-router";
import React from 'react';
const ProjectList = ({ projects }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;