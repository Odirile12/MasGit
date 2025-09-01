import React from "react";

import {Link} from  "react-router";
import Backround from "../components/Background"

const Spash = () => {
    return (
        <>
            <Backround/>
            <Link to ="/Login" >Login</Link>
            <Link to="/SignIn">Sign in</Link>
        </>
    );
}

export default Spash