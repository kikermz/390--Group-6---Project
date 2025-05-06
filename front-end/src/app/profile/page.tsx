"use client";
import Post from "@/components/Post";
import Image from "next/image";
import EditProfileModal from "@/components/EditProfile";
import { useEffect, useState } from "react";

interface ProfileProps {
  username: string;
}

export default function Profile({ username }: ProfileProps) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  interface PostType {
    postID: string;
    content: string;
    username: string;
    media?: string;
    created_at: string;
  }
  
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false); // Follow status
  const [loggedInUserID, setLoggedInUserID] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setLoggedInUserID(parsed.id); // Store the logged-in user's ID
    }

    if (username) {
      // Fetch user profile data
      fetch(`http://localhost:5000/user/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDisplayName(data.user.displayName);
            setBio(data.user.bio);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
        });

      // Fetch user posts
      fetch(`http://localhost:5000/grabUserPosts?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPosts(data.posts);
          } else {
            setError(data.message || "Failed to fetch posts.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user posts:", err);
          setError("An error occurred while fetching posts.");
        });

      // Check follow status
      if (loggedInUserID) {
        fetch(
          `http://localhost:5000/isFollowing?followerID=${loggedInUserID}&followedID=${username}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsFollowing(data.isFollowing);
            }
          })
          .catch((err) => console.error("Error checking follow status:", err));
      }
    }
  }, [username, loggedInUserID]);

  const handleFollow = () => {
    fetch("http://localhost:5000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerID: loggedInUserID, followedID: username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsFollowing(true);
        }
      })
      .catch((err) => console.error("Error following user:", err));
  };

  const handleUnfollow = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerID: loggedInUserID, followedID: username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsFollowing(false);
        }
      })
      .catch((err) => console.error("Error unfollowing user:", err));
  };

  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div className="w-full bg-black">
        {/* Background Banner */}
        <div className="relative h-40 w-full">
          <Image
            src="/general/BannerEx.jpeg"
            layout="fill"
            alt="profile banner image"
          />
        </div>

        {/* Profile */}
        <div className="relative -mt-16 flex flex-col items-center">
          {/* Picture */}
          <div className="border-4 border-white rounded-lg">
            <Image
              src="/icons/FakeUser.jpg"
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>

          {/* Username */}
          <div className="relative -mt-12 px-4 flex flex-row items-start text-left w-full">
            <h1 className="mt-3 text-xl font-bold text-white">{displayName}</h1>
            <p className="mt-3 px-2 text-gray-500">@{username}</p>
          </div>

          <div className="flex pr-4 w-full border-t border-gray-300 mt-6">
            <button className="mt-5 flex justify-around border-b px-4 pb-3 hover:text-gray-800">
              Followers
            </button>
            <button className="mt-5 flex justify-around border-b px-4 pb-3 hover:text-gray-800">
              Following
            </button>

            {loggedInUserID !== username && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`mt-4 ml-auto rounded-lg px-4 py-2 ${
                  isFollowing
                    ? "bg-red-600 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 ml-auto rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-white hover:text-purple-600"
            >
              Edit
            </button>
          </div>
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSave={({ name, bio }) => {
              setDisplayName(name);
              setBio(bio);
            }}
            initialData={{
              name: displayName,
              bio: bio,
            }}
          />
          <p className="mt-2 text-sm text-white text-center px-4">{bio}</p>
        </div>

        {/* Profile Tabs (Posts, About, Followers) */}
        <div className="mt-5 flex justify-around border-b pb-3 text-gray-600">
          <button className="pb-2 border-b-4 border-purple-600 text-purple-600 font-semibold">
            Posts
          </button>
          <button className="hover:text-gray-800">Pictures</button>
          <button className="hover:text-gray-800">Videos</button>
        </div>

        {/* Posts Section */}
        <div className="mt-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.postID}
                postID={Number(post.postID)}
                content={post.content}
                username={post.username}
                media={post.media}
                createdAt={post.created_at}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No posts to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}