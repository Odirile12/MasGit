import React, { useState, useEffect } from "react";
import Nevigat from "../components/header/Nav";
import { Link, useParams } from "react-router";
import Project from "../components/ProjectPreview/Projects";
import EditProject from "../components/ProjectPreview/EditProject";
import Messages from "../components/ProjectPreview/Messages";
import Files from "../components/ProjectPreview/Files";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null); // single project object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProjectById() {
      try {
        const TOKEN =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const data = await response.json(); // ✅ use await here
        console.log("Fetched project:", data);

        setProject(data); // ✅ update state with API result
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }

    getProjectById();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="px-6 py-4 flex flex-col items-center gap-3">
        <Nevigat
          name="Project"
          lik={
            <Link
              to="/Feed"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Feed
            </Link>
          }
        />
      </header>

      <main className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="space-y-6 lg:col-span-1">
            <Project project={project} />
            <EditProject project={project} onSave={setProject} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Files files={project.files || []} />
            <Messages messages={project.messages || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
