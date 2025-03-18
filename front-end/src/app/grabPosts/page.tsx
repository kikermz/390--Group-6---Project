"use client"; // Required for Next.js App Router
import React,{ useState } from "react";

   // Define a Post type to match your database structure
   type Post = {
    postID: number;
    id: number; // User ID (foreign key)
    content: string;
    created_at: string;
    username: string;
};

const Posts = () => {
 
    // State to store posts
    const [posts, setPosts] = useState<Post[]>([]);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    // Function to fetch posts from the backend
    const fetchPosts = async () => {
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        setError("");

        try {
            const response = await fetch(`http://localhost:5000/grabPost?username=${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log("Data from backend:", data);
            if (data.success) {
                setPosts(data.posts);
            } else {
                setPosts([]);
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
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    marginRight: "10px",
                    padding: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    color: "black",  // Set input text color to black
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
                        {posts.map((post) => (
                            <li
                                key={post.postID}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    marginBottom: "25px",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "black",
                                    color: "white",
                                }}
                            >
                                <h4 style={{ margin: "0 0 5px 0" }}>{post.username}</h4>
                                <p>{post.content}</p>
                                <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
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