// 52_Masanabo
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import Project from "./Pages/Project";
import Posts from "./Pages/Posts";
import Spash from "./Pages/SpashPage"
import Login from "./Pages/Login"
import SignIn from "./Pages/Signin"
import Feed from "./Pages/Feed"
import Profile from "./Pages/Profile"
import Admin from "./Pages/Admin"
import AdminLogin from "./Pages/AdminLogin"
import AdminSignup from "./Pages/AdminSignup"
import FileViewer from './Pages/FileViewer';
import UserProfile from './Pages/UserProfile';
// import Profile from "./Pages/Profile";


const root = createRoot(document.getElementById("root"));
// ADMIN2024

root.render(
    <ThemeProvider>
        <div>
    <BrowserRouter>
        <Routes>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/" element={<Spash />} />
            <Route path="/Project/:id" element={<Project />} />
            <Route path="/Login" element={<Spash />} />
            <Route path="/SignIn" element={<Spash />} />
            <Route path="/Feed" element={<Feed />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/AdminSignup" element={<AdminSignup />} />
            <Route path="/project/:projectId/file/:filename" element={<FileViewer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<UserProfile />} />

            {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
        </Routes>
    </BrowserRouter>
        </div>
    </ThemeProvider>
);
