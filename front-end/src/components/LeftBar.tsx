"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react";
const LeftBar = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
  
    useEffect(() => {
      //get token , check first
      const token = localStorage.getItem("authToken");

      if (token) {
        const userData = localStorage.getItem("user");

        if (userData) {

            const userInfo = JSON.parse(userData);
            setLoggedIn(true);
            setUsername(userInfo.username);
            setDisplayName(userInfo.username);//will need to adapt later one to use a Display Name
        }
      }
    }, []);


    return (
        <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
            {/*Menu Items*/}
            <div className="flex flex-col gap-4 text-lg items-center">
                {/*Company Logo*/}
                <Link href="/">
                    <Image src="/icons/CompLogoHolder.png" alt="C" width={24} height={24} />
                </Link>

                <div className="flex flex-col gap-2">
                    {/*Will Replace SEARCH with search bar */}
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Search</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Home</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Trending</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Inbox</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">News</span>
                    </Link>
                    <Link href="/notifications" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Notifications</span>
                    </Link>
                    <Link href="/profile" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Profile</span>
                    </Link>
                    <Link href="/auth/login" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Login</span>
                    </Link>
                    <Link href="/auth/signup" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Sign Up</span>
                    </Link>
                    <Link href="/createPost" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Create Post</span>
                    </Link>
                    <Link href="/grabPosts" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Grab Posts</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">More ...</span>
                    </Link>

                </div>
            </div>

            {/*Profile*/}
            <div className="flex items-center justify-between gap-2 w-full">
            {!loggedIn ? (<div className="flex items-center justify-between gap-2 w-full">
                <Link href="/auth/login" className="p-2 rounded-full text-black font-bold bg-white hover:bg-purple-600">
                        <span className="">Login</span>
                    </Link>
                <Link href="/auth/signup" className="p-2 rounded-full text-black font-bold bg-white hover:bg-purple-600">
                        <span className="">Sign Up</span>
                    </Link>
                    </div>
            
            ):(
            <div className="flex items-center justify-between gap-3">
                <div className="">
                    <Image src="/icons/user.png" alt="User Image" width={30} height={30} />
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold">{displayName}</span>
                    <span className="text-xs ">@{username}</span>
                </div>
            </div>
            )}
        </div>
        </div>
    )
}
export default LeftBar