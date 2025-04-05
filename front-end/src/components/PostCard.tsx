import React from "react";


interface PostCardProps {
    content: string;
    username: string;
    media?: string;
  }
  
  const PostCard: React.FC<PostCardProps> = ({ content, username, media }) => {
    return (
      <div className="bg-white text-black rounded-lg shadow-md p-4 mb-4">
        <p className="font-semibold">@{username}</p>
        <p className="mt-2">{content}</p>
        {media && (
          <img
            src={`http://localhost:5000/uploads/${media}`}
            alt="Post media"
            className="mt-3 w-full max-h-80 object-cover rounded-lg"
          />
        )}
      </div>
    );
  };

const styles = {
    card: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "10px 0",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "8px"
    },
    content: {
        fontSize: "20px",
        marginBottom: "12px",
        color: "#333"
    },
    date: {
        fontSize: "14px",
        color: "#777"
    }
};

export default PostCard;