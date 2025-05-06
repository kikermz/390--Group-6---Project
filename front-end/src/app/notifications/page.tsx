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
      {/* Make the heading bigger and bold */}
      <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Notifications</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {notifications.map((notification, index) => (
          <li
            key={index}
            style={{
              fontSize: "1.2rem", // Make the notification text bigger
              marginBottom: "1rem", // Add spacing between notifications
              borderBottom: "1px solid #ccc", // Add a line between notifications
              paddingBottom: "0.5rem", // Add padding below each notification
            }}
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;