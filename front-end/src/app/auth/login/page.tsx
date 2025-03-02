"use client"; // Required for Next.js App Router

import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // For success/error feedback

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error("Error connecting to server:", error);
            setMessage("Failed to connect to the server.");
        }
    };
    

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-bold mb-4 text-center text-black">Login</h1> {/* Title in black */}
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-black bg-white" 
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-black bg-white"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-purple-600 text-white p-2 rounded font-bold hover:bg-purple-700"
                >
                    Login
                </button>

                {message && <p className="mt-2 text-center text-black">{message}</p>} {/* Message text in black */}
            </div>
        </div>
    );
};

export default Login;
