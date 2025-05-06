import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PostProps {
  content: string;
  username: string;
  media?: string;
  createdAt: string;
  postID: number; // Added postID to identify the post for likes and comments
}

const Post = ({ content, username, media, createdAt, postID }: PostProps) => {
  // Determine if the media is an image or video based on the file extension
  const isImage = media ? media.match(/\.(jpeg|jpg|png|gif|webp)$/) : null;
  const isVideo = media ? media.match(/\.(mp4|webm|ogg)$/) : null;

  // State for likes
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // State for comments
  const [comments, setComments] = useState<{ content: string; username: string }[]>([]);
  const [newComment, setNewComment] = useState("");

  // Fetch likes and comments when the component mounts
  useEffect(() => {

    const userID = localStorage.getItem("userID");
    // Fetch likes count
    fetch(`http://localhost:5000/getLikes/${postID}?userID=${userID}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setLikes(data.likes); // Set the like count
        setLiked(data.userLiked); // Set the user's like status
      }
    })
    .catch((err) => console.error("Error fetching likes:", err));

  // Fetch comments
  fetch(`http://localhost:5000/getComments/${postID}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setComments(data.comments);
      }
    })
    .catch((err) => console.error("Error fetching comments:", err));
}, [postID]);

  // Handle like/unlike
  const handleLike = () => {
    const userID = localStorage.getItem("userID"); // Replace with actual user ID
    if (!liked) {
      // Like the post
      fetch("http://localhost:5000/likePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID, userID }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLikes(data.likes); // Update the like count from the backend
            setLiked(data.liked);
          } else {
            console.error(data.message); // Handle cases where the user has already liked the post
          }
        })
        .catch((err) => console.error("Error liking post:", err));
    } else {
      // Unlike the post
      fetch("http://localhost:5000/unlikePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID, userID }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLikes(data.likes); // Update the like count from the backend
            setLiked(data.liked);
          } else {
            console.error(data.message);
          }
        })
        .catch((err) => console.error("Error unliking post:", err));
    }
  };

  // Handle adding a comment
  const handleAddComment = () => {
    const userID = localStorage.getItem("userID"); // Replace with actual user ID
    if (newComment.trim() === "") return;

    fetch("http://localhost:5000/addComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID, userID, content: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments([...comments, { content: newComment, username: "You" }]);
          setNewComment("");
        }
      })
      .catch((err) => console.error("Error adding comment:", err));
  };

  return (
    <div className="p-4 border-y-[1px] border-borderPurp">
      {/*Post Content*/}
      <div className="flex gap-4">
        {/*avatar*/}
        <div className="rounded-full overflow-hidden">
          <Image src="/icons/user.png" alt="User Image" width={30} height={30} />
        </div>

        {/*Content*/}
        <div className="flex-1 flex flex-col gap-2">
          {/*Header*/}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Make the username clickable */}
              <Link href={`/profile/${username}`}>
                {username}
              </Link>
              <span className="text-xs text-gray-600">@{username}</span>
            </div>
            <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
          </div>

          {/*Post Content*/}
          <p>{content}</p>

          {/*Media Content: Image or Video*/}
          {isImage ? (
            <Image
              src={`http://localhost:5000${media}`}
              alt="Post media"
              width={600}
              height={600}
            />
          ) : isVideo ? (
            <video controls width="600">
              <source src={`http://localhost:5000${media}`} type="video/mp4" />
              <source src={`http://localhost:5000${media}`} type="video/webm" />
              <source src={`http://localhost:5000${media}`} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : null}

           {/* Likes and Comment Input Section */}
      <div className="flex items-center gap-2 mt-4">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded ${
            liked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {liked ? "Unlike" : "Like"} ({likes})
        </button>

        {/* Comment Input */}
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border rounded px-2 py-1 text-black" // Ensure text is black
        />

        {/* Comment Button */}
        <button
          onClick={handleAddComment}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          Comment
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <h3 className="font-bold">Comments</h3>
        <ul className="mt-2">
          {comments.map((comment, index) => (
            <li key={index} className="mb-2">
              <strong>{comment.username}</strong>: {comment.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>
  );
};

export default Post;