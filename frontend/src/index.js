
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";
import Home from "./Pages/Home";
import Posts from "./Pages/Posts";
import Spash from "./Pages/SpashPage"
import Login from "./Pages/Login"
import SignIn from "./Pages/Signin"

const root = createRoot(document.getElementById("root"));

const router = createBrowserRouter([
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
            <Route path="/" element={<Spash />} />
            <Route path="/Login" element={<Login />} />
            {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
        </Routes>
    </BrowserRouter>
        </div>

);












