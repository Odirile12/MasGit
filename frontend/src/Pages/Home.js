import React from "react";
import {Link} from  "react-router";

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <Link to ="/" >Home</Link>
            <Link to="/posts">Posts</Link>
        </div>
    );
}
export default Home;