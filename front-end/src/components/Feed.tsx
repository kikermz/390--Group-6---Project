"use client";
import Image from "next/image";
import Link from "next/link";
import Post from "./Post";
import PostCard from "./PostCard"; 
import { useState, useEffect } from "react";

interface PostType {
  postID: number;
  content: string;
  created_at: string;
  username: string;
  media?: string;
}

const Feed = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch posts sorted by newest
    fetch("http://localhost:5000/grabAllPosts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.error("Error fetching posts", err));
  }, []);

  return (
    <div className="">
      {!loggedIn ? (
        <div className="">
     
        </div>
      ) : (
        <div className="">
      
      {posts.map((post, index) => (
            <Post
            key={index}
            content={post.content}
            username={post.username}
            media={post.media}
            createdAt={post.created_at}
          />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;