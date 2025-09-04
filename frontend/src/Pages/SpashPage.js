import React from "react";

import {Link} from  "react-router";
import Backround from "../../public/background.svg"

const Spash = () => {
    console.log(Backround)
    return (
    
        <div className="w-full flex items-center justify-center  h-screen bg-[url('../../public/svgviewer-png-output.png')] text-white">
            <Link to ="/Login"  className="m-10 text-6xl font-extralight p-5 font-sans hover:bg-[rgba(255,255,255,0.32)]">Login</Link>
            <div className="m-10 text-6xl font-extralight font-sans">  |</div>
            <Link to="/SignIn" className="m-10 text-6xl font-extralight p-5 font-sans hover:bg-[rgba(255,255,255,0.32)]">Sign in</Link>
        </div>
        
    );
}

export default Spash