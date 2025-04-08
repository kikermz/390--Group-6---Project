const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password123", // Change to whatever your local mysql password is
    database: "userDB" // Change to whatever your local db is set
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
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
app.post("/createPost", (req, res) => {
    const { userID, content } = req.body; // Ensure correct variable

    if (!userID || !content.trim()) {
        return res.status(400).json({ success: false, message: "User ID and content are required" });
    }

    db.query("INSERT INTO posts (id, content) VALUES (?, ?)", [userID, content], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to create post" });
        res.json({ success: true, message: "✅ Post created successfully!" });
    });
});



//Grab-Notification Route
app.get("/notifications", (req, res) => {
    console.log("Pulling notifications...");
    db.query("SELECT notify, createdAt FROM notifications order by createdAt ASC", (err, results) => {
        if(err){
            res.json({ success: false, message: "Pull failed! "+err});
        }else{
            res.json({success: true, message:results});
        }
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
        SELECT posts.postID, posts.content, posts.created_at, users.username
        FROM posts
        INNER JOIN users ON posts.id = users.id
        WHERE users.username = ?
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


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
