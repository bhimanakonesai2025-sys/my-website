const express = require("express");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGODB_URI);

let messagesCollection;

// Connect to MongoDB
async function connectDatabase() {
    await client.connect();

    const database = client.db("myWebsiteDB");

    messagesCollection = database.collection("messages");

    console.log("Connected to MongoDB");
}

connectDatabase().catch(console.error);

// Allow JSON data
app.use(express.json());

// Serve website files
app.use(express.static(__dirname));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Project data
const projects = [
    "Personal Portfolio Website hosted using GitHub Pages.",
    "Java Programming Applications.",
    "SQL Database Assignments.",
    "Linux Command Practice."
];

// Contact data
const contact = {
    email: "bhimanakone.sai2025@vitstudent.ac.in",
    github: "https://github.com/bhimanakonesai2025-sys"
};

// Get projects
app.get("/api/projects", (req, res) => {
    res.json(projects);
});

// Get contact information
app.get("/api/contact", (req, res) => {
    res.json(contact);
});

// Save messages to MongoDB
app.post("/api/messages", async (req, res) => {
    try {
        const message = {
            ...req.body,
            createdAt: new Date()
        };

        await messagesCollection.insertOne(message);

        console.log("New message saved to MongoDB");

        res.json({
            success: true,
            message: "Your message was saved successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to save message"
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});