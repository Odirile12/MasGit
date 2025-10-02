
import React, { useState, useEffect } from "react";
import Nevigat from "../components/header/Nav";
import { Link, useParams } from "react-router";
import Project from "../components/ProjectPreview/Projects";
import EditProject from "../components/ProjectPreview/EditProject";
import Messages from "../components/ProjectPreview/Messages";
import Files from "../components/ProjectPreview/Files";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  // const [currentUserId, setCurrentUserId] = useState(null);

  const fetchProject = async () => {
    try {
      const TOKEN = localStorage.getItem("token") || sessionStorage.getItem("token");

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


      

      const data = await response.json(); 
      console.log("Fetched project:", data);

      setProject(data);
      
      // Get current user info
      const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUserId(userData._id);
        
        // Check permissions
        const ownerCheck = data.owner && data.owner._id === userData._id;
        const memberCheck = data.members && data.members.some(member => member._id === userData._id);
        
        setIsOwner(ownerCheck);
        setIsMember(memberCheck);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Project not found</p>
          <Link 
            to="/Feed" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to Feed
          </Link>
        </div>
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
            <Project project={project} currentUserId={currentUserId}/>
            {(isOwner || isMember) && (
              <EditProject project={project} currentUserId={currentUserId} onSave={setProject} />
            )}
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Files 
              files={project.files || []} 
              projectId={id}
              isOwner={isOwner}
              isMember={isMember}
            />
            <Messages messages={project.messages || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;