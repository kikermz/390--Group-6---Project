"use client"
import Image from "next/image"
import Link from "next/link"
import Post from "./Post"
import { useState, useEffect } from "react";

const Feed = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      //get token , check first
      const token = localStorage.getItem("authToken");

      if (token) {
        const userData = localStorage.getItem("user");

        if (userData) {

            const userInfo = JSON.parse(userData);
            setLoggedIn(true);
        }
      }
    }, []);
    return (
        <div className="">
            {!loggedIn ? (<div className="">
                <Post/>
                    </div>

            ):(
            <div className="">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
            )}

        </div>

    )
}
export default Feed