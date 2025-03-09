"use client"; // Required for Next.js App Router
import React, { useState, useEffect } from "react";

const Posts = () => {
    // State to store posts
    const [posts, setPosts] = useState([]);
    const [userID, setUserID] = useState("");
    const [error, setError] = useState("");

    // Function to fetch posts from backend
    const fetchPosts = async () => {
        if (!userID.trim()) {
            setError("User ID is required.");
            return;
        }

        setError(""); // Clear error before new fetch

        try {
            const response = await fetch(`http://localhost:5000/grabPost?userID=${userID}`);
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
            <input
                type="text"
                placeholder="Enter User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            />
            <button onClick={fetchPosts}>Get Posts</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {posts.length > 0 ? (
                <div>
                    <h3>Fetched Posts:</h3>
                    <ul>
                        {posts.map((post, index) => (
                            <li key={index}>{post.content}</li>
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