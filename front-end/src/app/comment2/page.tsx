"use client"
import { useState } from "react";

const Comments = () => { //Comment function
interface Comment { //Display/Interface for comments
    //id: string;
    body: string;
}

const dummyComments: Array<Comment> = [ //Practice comments
    {
        //id: '1',
        body: 'This is comment 1',
    },
    {
        //id: '2',
        body: "This is comment 2"
    },
    {
        //id: '3',
        body: "This is comment 3"
    }
]

    const [message, setMessage] = useState("");
    const [comments, setComments] = useState(dummyComments); //Sets the state of practice comments
    const [commentBody, setCommentBody] = useState('');
    const onComment = () => { //Comment Function
        const newComment: Comment = {
            //id: 
            body: commentBody,
        };

        setComments((prev) => [newComment, ...prev]);
        setCommentBody("");
    };


    return(
        <div className="flex flex-col gap-6 h-screen w-screen p-6">
            <span className="text-3xl">React Nested Comments</span>
            <div className="flex flex-col">
                <input 
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)} 
                placeholder="What are your thoughts?" 
                className="border-[1px] border-zinc-400 p-4 w-full"/>
                <button className="border-[1px] rounded-full border-zinc-400 w-20" 
                onClick={() => onComment()}>Comment
                </button>
            </div>
            <div className="flex flex-col gap-4 mt-10">
             {comments.map(comment => (
                <CommentItem comment={comment}/>
                ))}   
            </div>
        </div>
        
    );
}

interface CommentItemProps{
    comment: Comment;
}

const CommentItem = ( {comment}: CommentItemProps ) => {
    return{
        <div className="border-[1px] border-zinc-500 rounded-md">
        {comment.body}
        </div>
    };
};

//export default Comments;