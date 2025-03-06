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
    database: "userdb"
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

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
