"use client";

import { useParams } from "next/navigation";
import Profile from "@/app/profile/page";

const UserProfile = () => {
  const { username } = useParams(); // Get the username from the dynamic route

  if (!username) return <p>Loading...</p>;

  return <Profile username={username as string} />;
};

export default UserProfile;