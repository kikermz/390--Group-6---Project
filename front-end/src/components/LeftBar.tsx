"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react";
const LeftBar = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Mark the component as mounted

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

      // Fetch unread notification count
    const userID = localStorage.getItem("userID"); // Replace with actual user ID
    if (userID) {
      fetch(`http://localhost:5000/getNotifications?userID=${userID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUnreadCount(data.unreadCount); // Set the unread notification count
          }
        })
        .catch((err) => console.error("Error fetching unread notifications:", err));
    }
    }, []);

    if (!isMounted) {
        // Prevent rendering until the component has mounted
        return null;
      }

    return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* Menu Items */}
      <div className="flex flex-col gap-4 text-lg items-center">
        {/* Company Logo */}
        <Link href="/">
          <Image src="/icons/CompLogoHolder.png" alt="C" width={24} height={24} />
        </Link>

        <div className="flex flex-col gap-2">
          {/* Will Replace SEARCH with search bar */}
          <Link href="/grabPosts" className="p-2 rounded-full hover:bg-[#301e48]">
            <span className="">Search</span>
          </Link>
          <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
            <span className="">Home</span>
          </Link>
          <Link href="/notifications" className="p-2 rounded-full hover:bg-[#301e48] relative flex items-center">
            <span className="">Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link href={`/profile/${username}`} className="p-2 rounded-full hover:bg-[#301e48]">
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
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center justify-between gap-2 w-full">
        {!loggedIn ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <Link href="/auth/login" className="p-2 rounded-full text-black font-bold bg-white hover:bg-purple-600">
              <span className="">Login</span>
            </Link>
            <Link href="/auth/signup" className="p-2 rounded-full text-black font-bold bg-white hover:bg-purple-600">
              <span className="">Sign Up</span>
            </Link>
          </div>
        ) : (
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
  );
};

export default LeftBar;