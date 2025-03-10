/**
 * 
 * Created by William Burbatt
 * altered by Luis 3/4/25
 */
"use client"; // Required for Next.js App Router

import { useState } from "react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // For success/error feedback
    const [error, setError] = useState(""); // For validation errors

    const handleSignup = async () => {
        setMessage("");
        setError("");

        if (!name || !email || !username || !password) {
            setError("All fields are required.");
            return;
        }

        console.log(`Sending Name: ${name}, Email: ${email}, Username: ${username}, Password: ${password} to the server.`);

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, username, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Signup failed. Please try again.");
            } else {
                setMessage("Signup successful! You can now log in.");
            }

        } catch (error) {
            console.error("Error connecting to server:", error);
            setMessage("Failed to connect to the server.");
        }
    };
    

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="bg-black p-6 rounded-lg shadow-lg w-80 border rounded">
                <h1 className="text-xl font-bold mb-4 text-center text-white">Signup</h1> {/* Title in black */}
                
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-white bg-black"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-white bg-black"
                />
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
                    onClick={handleSignup}
                    className="w-full bg-white text-black p-2 rounded font-bold hover:bg-purple-700"
                >
                    Signup
                </button>
                {message && <p className="mt-2 text-center text-white">{message}</p>} {/*Success*/}
                {error && <p className="mt-2 text-center text-white">{error}</p>} {/* Fail*/}
                
            </div>
        </div>
    );
};

export default Signup;
