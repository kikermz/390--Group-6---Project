const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password123", // Change to whatever your local mysql password is
    database: "userDB" // Change to whatever your local db is set
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
});

//  Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // Ensure folder exists
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Upload Media Route
app.post("/uploadMedia", upload.single("media"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`; // Public path for client
    res.json({ success: true, filePath });
});


// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("Serverside this is username " + username + " and this is password: " + password);

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            res.json({ success: false, message: "Login failed!" });

        } else if (result.length > 0) {
            //hash pass and compare to the db
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (err) {
                    return res.json({ success: false, message: "Error" });
                } else if (match) {
                    // Send userID in the response
                    const userID = result[0].id; 
                    return res.json({
                        success: true,
                        message: "Login successful!",
                        userID: userID,  // Send the userID to the frontend
                    });
                } else {
                    return res.json({ success: false, message: "Invalid Login" });
                }
            });
        } else {
            return res.json({ success: false, message: "Invalid Login." });
        }
    });
});

//sign up route
app.post("/signup", (req, res) => {
    const { name, email, username, password } = req.body;

    // Check if the username already exists
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error" });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Username Exists!" });
        }

        console.log(`Serverside: Name: ${name}, Email: ${email}, Username: ${username}, Password: ${password}`);
        
        //Encrypt the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Problem Hashing Password" });
            }

        // Insert new user into the database
        db.query(
            "INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)", 
            [name, email, username, hashedPassword], 
            (err) => {
                if (err) {
                    console.error("Couldnt Insert User:", err);
                    return res.status(500).json({ success: false, message: "Signup failed!" });
                } else {
                    return res.json({ success: true, message: `Signup successful for username: ${username}` });
                }
            }
        );
    });
});
});



//  Create Post Route
app.post("/createPost", upload.single("media"), (req, res) => {
    const { userID, content } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : null; // Get file path

    if (!userID || !content.trim()) {
        return res.status(400).json({ success: false, message: "User ID and content are required" });
    }

    db.query("INSERT INTO posts (id, content, media) VALUES (?, ?, ?)", [userID, content, media], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to create post" });
        res.json({ success: true, message: "✅ Post created successfully!" });
    });
});



//Grab-Notification Route
app.get("/getNotifications", (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const query = "SELECT * FROM notifications WHERE userID = ? ORDER BY created_at DESC";
    const unreadCountQuery = "SELECT COUNT(*) AS unreadCount FROM notifications WHERE userID = ? AND is_read = FALSE";

    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch notifications." });
        }

        db.query(unreadCountQuery, [userID], (err, unreadResults) => {
            if (err) {
                console.error("Error fetching unread notification count:", err);
                return res.status(500).json({ success: false, message: "Failed to fetch unread notification count." });
            }

            const unreadCount = unreadResults[0].unreadCount;
            res.json({ success: true, notifications: results, unreadCount });
        });
    });
});

// Mark Notifications as Read
app.put("/markNotificationsAsRead", (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const query = "UPDATE notifications SET is_read = TRUE WHERE userID = ?";

    db.query(query, [userID], (err) => {
        if (err) {
            console.error("Error marking notifications as read:", err);
            return res.status(500).json({ success: false, message: "Failed to mark notifications as read." });
        }

        res.json({ success: true, message: "Notifications marked as read." });
    });
});

// Grab Post
app.post("/grabPost", (req, res) => {
    console.log("Grab posts called...");
    const { username } = req.query;  // Using username 

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    const query = `
        SELECT posts.postID, posts.content, posts.created_at, posts.media, users.username
    FROM posts
    INNER JOIN users ON posts.id = users.id
    WHERE users.username = ? 
    ORDER BY posts.created_at DESC
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("Failed to retrieve posts:", err);
            return res.status(500).json({ success: false, message: "Failed to retrieve posts" });
        }

        if (results.length > 0) {
            res.json({ success: true, posts: results });
        } else {
            res.json({ success: false, message: "No posts found for this user" });
        }
    });
});
//Profile info grab
app.get("/user/:username", (req, res) => {
    const { username } = req.params;
    const query = "SELECT username, name, bio FROM users WHERE username = ?"


    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Error Getting User Info", err);
        return res.status(500).json({ success: false, message: "Error Getting User Info" });
      }
     
      const user = results[0];
      res.json({
        success: true,
        user: {
          username: user.username,
          displayName: user.name,
          bio: user.bio,
        }
      });
    });
  });


//Profile Edit
app.put("/editProfile", (req, res) => {
    const { username, name, bio } = req.body;
 
    const query = "UPDATE users SET name = ?, bio = ? WHERE username = ?";
 
    db.query(query, [name, bio, username], (err, result) => {
      if (err) {
        console.error("Couldnt Update:", err);
        return res.status(500).json({ success: false, message: "Error." });
      }
      res.json({ success: true, message: "Update Successfull✅" });
    });
  });

//Grab all posts by newest for the feed
app.get("/grabAllPosts", (req, res) => {
    const query = `
        SELECT posts.postID, posts.content, posts.media, posts.created_at, users.username
        FROM posts
        INNER JOIN users ON posts.id = users.id
        ORDER BY posts.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Failed to retrieve all posts:", err);
            return res.status(500).json({ success: false, message: "Failed to retrieve posts" });
        }

        return res.json({ success: true, posts: results });
    });
});

app.get("/grabUserPosts", (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    const query = `
        SELECT posts.postID, posts.content, posts.media, posts.created_at, users.username
        FROM posts
        INNER JOIN users ON posts.id = users.id
        WHERE users.username = ?
        ORDER BY posts.created_at DESC
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error("❌ Failed to retrieve user posts:", err);
            return res.status(500).json({ success: false, message: "Failed to retrieve posts" });
        }

        return res.json({ success: true, posts: results });
    });
});

//route for the right side bar
app.get('/randomUsers', (req, res) => {
    const currentUserID = req.query.userID;

    // Check if userID is provided
    if (!currentUserID) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Query the database
    db.query(
        "SELECT username FROM users WHERE id != ? ORDER BY RAND() LIMIT 4", // Use 'id' instead of 'userID'
        [currentUserID],
        (err, results) => {
            if (err) {
                console.error("Error fetching random users:", err);
                return res.status(500).json({ success: false, message: "Server Error" });
            }

            // Return the results
            res.json({ success: true, users: results });
        }
    );
});


app.post("/follow", (req, res) => {
    const { followerID, followedID } = req.body;

    if (!followerID || !followedID) {
        return res.status(400).json({ success: false, message: "Both followerID and followedID are required." });
    }

    const query = "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)";
    const notificationQuery = `
        INSERT INTO notifications (userID, message)
        VALUES (?, CONCAT((SELECT username FROM users WHERE id = ?), ' followed you.'))
    `;

    db.query(query, [followerID, followedID], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ success: false, message: "Already following this user." });
            }
            console.error("Error following user:", err);
            return res.status(500).json({ success: false, message: "Failed to follow user." });
        }

        // Add a notification for the followed user
        db.query(notificationQuery, [followedID, followerID], (err) => {
            if (err) {
                console.error("Error creating follow notification:", err);
            }
        });

        res.json({ success: true, message: "User followed successfully." });
    });
});

app.delete("/unfollow", (req, res) => {
    const { followerID, followedID } = req.body;

    if (!followerID || !followedID) {
        return res.status(400).json({ success: false, message: "Both followerID and followedID are required." });
    }

    const query = "DELETE FROM follows WHERE follower_id = ? AND followed_id = ?";

    db.query(query, [followerID, followedID], (err) => {
        if (err) {
            console.error("Error unfollowing user:", err);
            return res.status(500).json({ success: false, message: "Failed to unfollow user." });
        }

        res.json({ success: true, message: "User unfollowed successfully." });
    });
});

app.get("/isFollowing", (req, res) => {
    const { followerID, followedID } = req.query;

    if (!followerID || !followedID) {
        return res.status(400).json({ success: false, message: "Both followerID and followedID are required." });
    }

    const query = "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?";

    db.query(query, [followerID, followedID], (err, results) => {
        if (err) {
            console.error("Error checking follow status:", err);
            return res.status(500).json({ success: false, message: "Failed to check follow status." });
        }

        res.json({ success: true, isFollowing: results.length > 0 });
    });
});

// Add a comment
app.post("/addComment", (req, res) => {
    const { postID, userID, content } = req.body;

    if (!postID || !userID || !content.trim()) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const insertQuery = "INSERT INTO comments (postID, userID, content) VALUES (?, ?, ?)";
    const notificationQuery = `
        INSERT INTO notifications (userID, message)
        SELECT posts.id, CONCAT(users.username, ' commented on your post: "', ?, '".')
        FROM posts
        INNER JOIN users ON users.id = ?
        WHERE posts.postID = ?
    `;

    db.query(insertQuery, [postID, userID, content], (err) => {
        if (err) {
            console.error("Error adding comment:", err);
            return res.status(500).json({ success: false, message: "Failed to add comment" });
        }

        // Add a notification for the post owner
        db.query(notificationQuery, [content, userID, postID], (err) => {
            if (err) {
                console.error("Error creating notification:", err);
            }
        });

        res.json({ success: true, message: "Comment added successfully" });
    });
});

// Get comments for a post
app.get("/getComments/:postID", (req, res) => {
    const { postID } = req.params;

    const query = `
        SELECT comments.commentID, comments.content, comments.created_at, users.username
        FROM comments
        INNER JOIN users ON comments.userID = users.id
        WHERE comments.postID = ?
        ORDER BY comments.created_at ASC
    `;
    db.query(query, [postID], (err, results) => {
        if (err) {
            console.error("Error fetching comments:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch comments" });
        }
        res.json({ success: true, comments: results });
    });
});

// Like a post
app.post("/likePost", (req, res) => {
    const { postID, userID } = req.body;

    if (!postID || !userID) {
        return res.status(400).json({ success: false, message: "Both postID and userID are required." });
    }

    const checkQuery = "SELECT * FROM likes WHERE postID = ? AND userID = ?";
    const insertQuery = "INSERT INTO likes (postID, userID) VALUES (?, ?)";
    const deleteQuery = "DELETE FROM likes WHERE postID = ? AND userID = ?";
    const countQuery = "SELECT COUNT(*) AS likeCount FROM likes WHERE postID = ?";
    const notificationQuery = `
        INSERT INTO notifications (userID, message)
        SELECT posts.id, CONCAT(users.username, ' liked your post.')
        FROM posts
        INNER JOIN users ON users.id = ?
        WHERE posts.postID = ?
    `;

    db.query(checkQuery, [postID, userID], (err, results) => {
        if (err) {
            console.error("Error checking like status:", err);
            return res.status(500).json({ success: false, message: "Failed to check like status." });
        }

        if (results.length > 0) {
            // User has already liked the post, so unlike it
            db.query(deleteQuery, [postID, userID], (err) => {
                if (err) {
                    console.error("Error unliking post:", err);
                    return res.status(500).json({ success: false, message: "Failed to unlike post." });
                }

                db.query(countQuery, [postID], (err, countResult) => {
                    if (err) {
                        console.error("Error fetching updated like count:", err);
                        return res.status(500).json({ success: false, message: "Failed to fetch updated like count." });
                    }

                    const likeCount = countResult[0].likeCount;
                    res.json({ success: true, likes: likeCount, liked: false });
                });
            });
        } else {
            // User has not liked the post, so like it
            db.query(insertQuery, [postID, userID], (err) => {
                if (err) {
                    console.error("Error liking post:", err);
                    return res.status(500).json({ success: false, message: "Failed to like post." });
                }

                // Add a notification for the post owner
                db.query(notificationQuery, [userID, postID], (err) => {
                    if (err) {
                        console.error("Error creating notification:", err);
                    }
                });

                db.query(countQuery, [postID], (err, countResult) => {
                    if (err) {
                        console.error("Error fetching updated like count:", err);
                        return res.status(500).json({ success: false, message: "Failed to fetch updated like count." });
                    }

                    const likeCount = countResult[0].likeCount;
                    res.json({ success: true, likes: likeCount, liked: true });
                });
            });
        }
    });
});


// Unlike a post
app.delete("/unlikePost", (req, res) => {
    const { postID, userID } = req.body;

    if (!postID || !userID) {
        return res.status(400).json({ success: false, message: "Both postID and userID are required." });
    }

    const deleteQuery = "DELETE FROM likes WHERE postID = ? AND userID = ?";
    const countQuery = "SELECT COUNT(*) AS likeCount FROM likes WHERE postID = ?";

    // Remove the like
    db.query(deleteQuery, [postID, userID], (err) => {
        if (err) {
            console.error("Error unliking post:", err);
            return res.status(500).json({ success: false, message: "Failed to unlike post." });
        }

        // Fetch the updated like count
        db.query(countQuery, [postID], (err, countResult) => {
            if (err) {
                console.error("Error fetching updated like count:", err);
                return res.status(500).json({ success: false, message: "Failed to fetch updated like count." });
            }

            const likeCount = countResult[0].likeCount;
            res.json({ success: true, likes: likeCount });
        });
    });
});

// Get likes for a post
app.get("/getLikes/:postID", (req, res) => {
    const { postID } = req.params;
    const { userID } = req.query; // Pass the logged-in user's ID as a query parameter

    const queryLikesCount = "SELECT COUNT(*) AS likeCount FROM likes WHERE postID = ?";
    const queryUserLiked = "SELECT * FROM likes WHERE postID = ? AND userID = ?";

    db.query(queryLikesCount, [postID], (err, likeCountResults) => {
        if (err) {
            console.error("Error fetching like count:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch like count" });
        }

        const likeCount = likeCountResults[0].likeCount;

        if (userID) {
            db.query(queryUserLiked, [postID, userID], (err, userLikedResults) => {
                if (err) {
                    console.error("Error checking if user liked post:", err);
                    return res.status(500).json({ success: false, message: "Failed to check user like status" });
                }

                const userLiked = userLikedResults.length > 0;
                res.json({ success: true, likes: likeCount, userLiked });
            });
        } else {
            res.json({ success: true, likes: likeCount, userLiked: false });
        }
    });
});

app.get("/getLoggedInUser", (req, res) => {
    const authToken = req.headers.authorization;
  
    if (!authToken) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing auth token" });
    }
  
    // Decode the token or fetch user data from the session
    const userID = decodeAuthToken(authToken); // Replace with your token decoding logic
    if (!userID) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  
    const query = "SELECT id, username FROM users WHERE id = ?";
    db.query(query, [userID], (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch user data" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, user: results[0] });
    });
  });

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
