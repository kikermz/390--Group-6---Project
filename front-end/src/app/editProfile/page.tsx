"use client";




import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation";




const editProfile = () => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false)


    const handleSave = async () => {
      const user = localStorage.getItem("user");
 
      if (!user) {
        setMessage("User not found. Please log in again.");
        return;
      }
      if (user) {


        const userInfo = JSON.parse(user);
        setLoggedIn(true);
    }
      const parsed = JSON.parse(user);
      const usernameFromLocal = parsed.username;
      setLoggedIn(true);
      const res = await fetch("http://localhost:5000/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameFromLocal,
          name: name,
          bio: bio,
        }),
      });
 
      const data = await res.json();
 
      if (data.success) {
        // update Local Storage in order for data to be the most recent
        const updatedUser = {
          ...parsed,
          name: name,
          bio: bio,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        router.push("/profile");
      } else {
        setMessage(data.message || "Something went wrong.");
      }


    };


return(
   
   <div className="flex items-center justify-center h-screen bg-black">
           <div className="bg-black p-6 rounded-lg shadow-lg w-80 border rounded">
               <h1 className="text-xl font-bold mb-4 text-center text-white">Edit Profile</h1> {/* Title in black */}
             
               <input
                   type="text"
                   placeholder="Name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full p-2 mb-3 border rounded text-white bg-black"
               />
               
               <input
                   type="text"
                   placeholder="Bio"
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   className="w-full p-2 mb-3 border rounded text-white bg-black h-20"
               />
               
               <Link href="/profile">
               <button
                   onClick={handleSave}
                   className="w-full bg-white text-black p-2 rounded font-bold hover:bg-purple-600"
               >
                   Save
               </button>
               </Link>
               {message && <p className="mt-2 text-center text-white">{message}</p>} {/* Message text in black */}
           </div>
       </div>
);
}
export default editProfile;


