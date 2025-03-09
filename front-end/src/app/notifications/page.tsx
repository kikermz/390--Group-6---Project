/**
 * 
 * Created by William Burbatt
 * 
 */

"use client"; // Required for Next.js App Router

import { useState } from "react";

const Notifications = () => {
    const [message, setMessage] = useState(""); // For success/error feedback

    const pullNotifications = async () => {
        try {
            const response = await fetch("http://localhost:5000/notifications", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            setMessage(JSON.stringify(result.message));

            if (result.success) {
                alert("✅ Pull Successful!");
            } else {
                alert("❌ Pull Failed.");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            setMessage("Failed to connect to the server.");
        }
    };

    
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-bold mb-4 text-center text-black">Pull Notifications</h1> {/* Title in black */}
                
                <button
                    onClick={pullNotifications}
                    className="w-full bg-purple-600 text-white p-2 rounded font-bold hover:bg-purple-700"
                >
                    Pull Notifications
                </button>
                {message && <p className="mt-2 text-center text-black">{message}</p>} {/* Message text in black */}
            </div>
        </div>
    );
};

export default Notifications;
