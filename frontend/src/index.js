
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";
import Home from "./Pages/Home";
import Posts from "./Pages/Posts";
import Spash from "./Pages/SpashPage"
import Login from "./Pages/Login"
import SignIn from "./Pages/Signin"
import Feed from "./Pages/Feed"
import Profile from "./Pages/profile"

const root = createRoot(document.getElementById("root"));

const router = createBrowserRouter([
    {
        path:"/Profile",
        element: <Profile/>
    },
    {
        path:"/Feed",
        element: <Feed/>
    },
    {
         path: "/Login",
        element:<Login/>
    },
    {
        path: "/SignIn",
        element:<SignIn/>
    },
    {
        path: "/",
        element:<Spash/>
    },
    {
        path: "/Home",
        element: <Home />,
    },
    { 
        path: "/posts",
        element: <Posts />,
    },
    
]);


root.render(
    

        <div>
    <BrowserRouter>
        <Routes>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/" element={<Spash />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/Feed" element={<Feed />} />
            {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
        </Routes>
    </BrowserRouter>
        </div>

);












