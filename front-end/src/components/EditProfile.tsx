"use client"
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type editProfile = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; bio: string }) => void;
    initialData: { name: string; bio: string };
};

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: editProfile) {
    const [name, setName] = useState("");
        const [bio, setBio] = useState("");
        const [message, setMessage] = useState("");
        const router = useRouter();
    
    
        const handleSave = async () => {
            
          const user = localStorage.getItem("user");
     
          if (!user) {
            setMessage("User not found. Please log in again.");
            return;
          }
          
       
          const parsed = JSON.parse(user);
          const usernameFromLocal = parsed.username;
          
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
            window.location.reload();
            router.push("/profile");
          } else {
            setMessage(data.message || "Something went wrong.");
          }
    };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-black rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
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
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="w-full bg-white text-black p-2 rounded font-bold hover:bg-purple-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-white text-black p-2 rounded font-bold hover:bg-purple-600"
          >
            Save
          </button>
          {message && <p className="mt-2 text-center text-white">{message}</p>}
        </div>
      </div>
    </div>
  );
}