"use client";  

import Image from "next/image";
import { useRouter } from "next/navigation";

const Share = () => {
    const router = useRouter();

    return (
        <div className="p-4 flex items-center gap-4 bg-black rounded-lg shadow-md">
            {/* Avatar */}
            <div className="rounded-full overflow-hidden">
                <Image src="/icons/user.png" alt="User Image" width={40} height={40} />
            </div>

            {/* Spacer to push button to the right side */}
            <div className="flex-grow flex justify-center">
                <button 
                    onClick={() => router.push("/createPost")}
                    className="bg-white text-black font-semibold rounded-lg py-3 px-6 text-lg hover:bg-gray-800 transition"
                >
                    Create Post
                </button>
            </div>
        </div>
    );
};

export default Share;