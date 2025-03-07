"use client";

import { useState } from "react";

function createPost() {
    const [content, setContent] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return alert("Post content cannot be empty.");
    
        const userID = localStorage.getItem("userID"); // Retrieve stored userID
        if (!userID) return alert("❌ You must be logged in to post.");
    
        try {
            const response = await fetch("http://localhost:5000/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, content }), // Now sending userID
            });
    
            const data = await response.json();
            if (data.success) {
                alert("✅ Post created successfully!");
                setContent(""); // Clear input
            } else {
                alert("❌ Failed to create post.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("❌ Network error, please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Write a post..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 flex-1 text-black bg-white placeholder-gray-500"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Post
                </button>
            </form>
        </div>
    );
}
export default createPost;