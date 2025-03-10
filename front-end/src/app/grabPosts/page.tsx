"use client"; // Required for Next.js App Router
import React, { useState } from "react";

const Posts = () => {
    // State to store posts
    const [posts, setPosts] = useState([]);
    const [userID, setUserID] = useState("");
    const [error, setError] = useState("");

    // Function to fetch posts from the backend
    const fetchPosts = async () => {
        if (!userID.trim()) {
            setError("User ID is required.");
            return;
        }

        setError(""); // Clear error before new fetch

        try {
            const response = await fetch(`http://localhost:5000/grabPost?userID=${userID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (data.success) {
                setPosts(data.posts); // Save posts in state
            } else {
                setPosts([]); // Clear posts if not found
                setError(data.message || "Failed to fetch posts.");
            }
        } catch (err) {
            setError("An error occurred while fetching posts.");
        }
    };

    return (
        <div>
            <h1>Posts</h1>
            {/* Input Field and Button */}
            <input
                type="text"
                placeholder="Enter User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                style={{
                    marginRight: "10px",
                    padding: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                }}
            />
            <button
                onClick={fetchPosts}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Get Posts
            </button>

            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Posts List */}
            {posts.length > 0 ? (
                <div>
                    <h3>Fetched Posts:</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {posts.map((post, index) => (
                            <li
                                key={index}
                                style={{
                                    border: "1px solid #ddd", 
                                    padding: "15px", 
                                    marginBottom: "25px", 
                                    borderRadius: "5px", 
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", 
                                    backgroundColor: "black"
                                }}
                            >
                                <h4 style={{ margin: "0 0 5px 0" }}>Post Title</h4>
                                <p>Welcome</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                !error && <p>No posts to display.</p>
            )}
        </div>
    );
};

export default Posts;
