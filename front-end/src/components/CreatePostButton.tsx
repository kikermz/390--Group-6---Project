import { useRouter } from "next/navigation";

const CreatePostButton = () => {
    const router = useRouter();

    return (
        <button 
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg w-full text-lg"
            onClick={() => router.push("/createPost")}
        >
            + Create a Post
        </button>
    );
};

export default CreatePostButton;