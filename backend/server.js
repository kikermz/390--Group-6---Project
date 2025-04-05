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

// ✅ Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Set up storage for multer
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


// ✅ Upload Media Route
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


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
