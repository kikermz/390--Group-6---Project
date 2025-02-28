import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log(); // Add this line for debugging

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));