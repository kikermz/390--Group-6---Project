/**
 * 
 * Created by William Burbatt
 * altered by Luis 3/4/25
 */

"use client"; // Required for Next.js App Router

import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // For success/error feedback

    const handleLogin = async () => {
        console.log("Send username: " + username + " and password: "+ password + "to the server.");
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            const result = await response.json();
            if (result.success) {
            // Store token in localStorage
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userID", result.userID);
            // Optionally, store user details if you want
            localStorage.setItem("user", JSON.stringify({ username }));
            window.location.href = "/";
        } else {
            setMessage(result.message);
        }
        } catch (error) {
            console.error("Error connecting to server:", error);
            setMessage("Failed to connect to the server.");
        }
    };
    

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="bg-black p-6 rounded-lg shadow-lg w-80 border rounded">
                <h1 className="text-xl font-bold mb-4 text-center text-white">Login</h1> {/* Title in black */}
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-white bg-black" 
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-white bg-black"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-white text-black p-2 rounded font-bold hover:bg-purple-600"
                >
                    Login
                </button>

                {message && <p className="mt-2 text-center text-white">{message}</p>} {/* Message text in black */}
            </div>
        </div>
    );
};

export default Login;
