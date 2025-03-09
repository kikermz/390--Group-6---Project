const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Add your MySQL root password if set
    database: "cmpsc390"
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

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            res.json({ success: false, message: "Login failed!" });
        } else if (results.length > 0) {
            const userID = results[0].id; // Get userID from the database
            res.json({ 
                success: true, 
                message: "Login successful!", 
                userID // Send userID to the frontend
            });
        } else {
            res.json({ success: false, message: "Invalid credentials." });
        }
    });
});

// Signup Route
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    console.log("Serverside this is username "+username +" and this is password: "+password);
    
    db.query("INSERT INTO users (username, password) VALUES (?,?)", [username, password], (err, results) => {
        if (err) {
            res.json({ success: false, message: "Signup failed!" });
        } else {
            res.json({ success: true, message: "Signup successful for username: "+username});
        }
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
    db.query("SELECT*FROM notifications order by createdAt ASC", (err, results) => {
        if(err){
            res.json({ success: false, message: "Pull failed! "+err});
        }else{
            res.json({success: true, message:results});
        }
    });
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
