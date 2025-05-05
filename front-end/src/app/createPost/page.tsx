"use client";
import { useState } from "react";

function CreatePost() {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userID = localStorage.getItem("userID");
        if (!userID) return alert("❌ You must be logged in to post.");
        if (!content.trim() && !media) return alert("❌ Please add content or media.");

        const formData = new FormData();
        formData.append("userID", userID);
        formData.append("content", content);
        if (media) formData.append("media", media);

        try {
            const response = await fetch("http://localhost:5000/createPost", {
                method: "POST",
                body: formData, 
            });

            const data = await response.json();
            if (data.success) {
                alert("✅ Post created!");
                setContent("");
                setMedia(null);
                // Redirect to homefeed
                window.location.href = "/";
            } else {
                alert("❌ Failed to create post.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("❌ Network error");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <textarea
                    placeholder="Write something..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 bg-white text-black"
                />
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                    className="bg-white text-black"
                />
                <button
                    type="submit"
                    className="bg-white text-black font-semibold rounded-lg py-3 px-6 text-lg hover:bg-gray-800 transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
}

export default CreatePost;