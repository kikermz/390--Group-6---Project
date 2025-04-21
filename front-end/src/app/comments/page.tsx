"use client";
import { useEffect, useState } from "react";

const Comments = () => {
    interface Comment {
        comment_id: number;
        post_id: number;
        user_id: number;
        comment_text: string;
        created_on: string;
    }

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBody, setCommentBody] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch("http://localhost:5000/comment")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setComments(data.message);
                } else {
                    setMessage(data.message);
                }
            })
            .catch((err) => {
                setMessage("Failed to fetch comments.");
                console.error(err);
            });
    }, []);

    const onComment = () => {
        // Add new comment logic (optional)
    };

    return (
        <div className="min-h-screen w-full bg-black text-white p-6">
            <h1 className="text-3xl mb-4">React Comments</h1>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input 
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)} 
                    placeholder="What are your thoughts?" 
                    className="flex-1 border border-zinc-300 p-2 text-black rounded" />
                <button 
                    onClick={onComment}
                    className="border border-zinc-400 rounded px-4 py-2 hover:bg-zinc-800 transition">
                    Comment
                </button>
            </div>

            {message && <p className="text-red-400 mb-4">{message}</p>}

            <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                    <div 
                        key={comment.comment_id} 
                        className="border border-zinc-500 rounded-md p-3 bg-zinc-900"
                    >
                        <p className="mb-1">{comment.comment_text}</p>
                        <p className="text-xs text-zinc-400">
                            User {comment.user_id} on {new Date(comment.created_on).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
