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
    password: "password123", // Add your MySQL root password if set
    database: "userDB"
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

    console.log("Serverside this is username "+username +" and this is password: "+password);
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            res.json({ success: false, message: "Login failed!" });
        } else if (results.length > 0) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.json({ success: false, message: "Invalid credentials." });
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
            return res.status(400).json({ success: false, message: "Username already exists!" });
        }

        console.log(`Serverside: Name: ${name}, Email: ${email}, Username: ${username}, Password: ${password}`);

        // Insert new user into the database
        db.query(
            "INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)", 
            [name, email, username, password], 
            (err, results) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ success: false, message: "Signup failed!" });
                } else {
                    return res.json({ success: true, message: `Signup successful for username: ${username}` });
                }
            }
        );
    });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
