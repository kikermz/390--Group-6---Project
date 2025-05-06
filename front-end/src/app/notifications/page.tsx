/**
 * 
 * Created by William Burbatt
 * 
 */

"use client"; // Required for Next.js App Router

import { useState, useEffect } from "react";

const Notifications = () => {
  interface Notification {
    message: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Replace with actual user ID

    fetch(`http://localhost:5000/getNotifications?userID=${userID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err));

       // Mark notifications as read
    fetch("http://localhost:5000/markNotificationsAsRead", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Notifications marked as read.");
          }
        })
        .catch((err) => console.error("Error marking notifications as read:", err));
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;