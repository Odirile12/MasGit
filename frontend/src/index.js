
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, createBrowserRouter,RouterProvider } from "react-router";
import Home from "./Pages/Home";
import Posts from "./Pages/Posts";

const root = createRoot(document.getElementById("root"));

const router = createBrowserRouter([
    {
        path: "/",
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
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
        </Routes>
    </BrowserRouter>
        </div>

);












