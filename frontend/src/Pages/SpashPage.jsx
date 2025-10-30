// 52_Masanabo
import React, { useState } from "react";
import GeometricSignInForm from "./Login";
import SignUpForm from "./Signin";

const Spash = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="w-full flex items-center justify-center h-screen bg-[url('../../public/svgviewer-png-output.png')] text-white relative">
            {/* Toggle Buttons */}
            <div className="absolute top-10 flex space-x-4">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`text-4xl font-extralight p-3 font-sans hover:bg-[rgba(255,255,255,0.32)] ${isLogin ? 'bg-[rgba(255,255,255,0.32)]' : ''}`}
                >
                    Login
                </button>
                <div className="text-4xl font-extralight font-sans">|</div>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`text-4xl font-extralight p-3 font-sans hover:bg-[rgba(255,255,255,0.32)] ${!isLogin ? 'bg-[rgba(255,255,255,0.32)]' : ''}`}
                >
                    Sign Up
                </button>
            </div>

            {/* Form Container */}
            <div className="flex items-center justify-center w-full h-full">
                {isLogin ? <GeometricSignInForm /> : <SignUpForm />}
            </div>
        </div>
    );
}

export default Spash
