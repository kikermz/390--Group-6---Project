"use client";
import Post from "@/components/Post";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";


export default function Profile() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio , setBio] = useState("");
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const usernameFromLocal = parsed.username;
 
      fetch(`http://localhost:5000/user/${usernameFromLocal}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsername(data.user.username);
            setDisplayName(data.user.displayName);
            setBio(data.user.bio);
          }
        })
        .catch(err => {
          console.error("Failed to fetch user profile:", err);
        });
    }
  }, []);
 return (
  //add in limited or no veiw based on logged in status
   <div className="flex min-h-screen justify-center bg-black">
     <div className="w-full bg-black ">
       {/* Background Banner */}
       <div className="relative h-40 w-full">
         <Image src="/general/BannerEx.jpeg" layout="fill" alt ="profile banner image"/>
       </div>




       {/* Profile */}




       <div className="relative -mt-16 flex flex-col items-center">
         {/*Picture */}
         <div className="border-4 border-white rounded-lg">
           <Image src="/icons/FakeUser.jpg" alt="Profile Picture" width={100} height={100} className="rounded-lg"/>
         </div>




         {/*Username*/}
         <div className="relative -mt-12 px-4 flex flex-row items-start text-left w-full">
         <h1 className="mt-3 text-xl font-bold text-white">{displayName}</h1>
         <p className="mt-3 px-2 text-gray-500">@{username}</p>
         </div>




         <div className="flex pr-4 w-full border-t border-gray-300 mt-6">
         <button className="mt-5 flex justify-around border-b px-4 pb-3 hover:text-gray-800">Followers</button>
         <button className="mt-5 flex justify-around border-b px-4 pb-3 hover:text-gray-800">Following</button>
         <Link href="/editProfile" className="mt-4 ml-auto rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-white hover:text-purple-600"><button className="">Edit</button></Link>
       
       
         </div>
       
         <p className="mt-2 text-sm text-white text-center px-4">{bio}</p>
       </div>




       {/* Profile Tabs (Posts, About, Followers) */}
       <div className="mt-5 flex justify-around border-b pb-3 text-gray-600">
         <button className="pb-2 border-b-4 border-purple-600 text-purple-600 font-semibold">Posts</button>
         <button className="hover:text-gray-800">Pictures</button>
         <button className="hover:text-gray-800">Videos</button>
       </div>
       <Post/>
       <Post/>
       <Post/>




     
     </div>
     </div>
 );
}
