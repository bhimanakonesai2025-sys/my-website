const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing!");
    process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

let messagesCollection;
let visitsCollection;

// Connect to MongoDB
async function connectDatabase() {
    try {
        await client.connect();

        const database = client.db("myWebsiteDB");

        messagesCollection = database.collection("messages");
        visitsCollection = database.collection("visits");

        console.log("MongoDB connection successful!");

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

connectDatabase();

// Middleware
app.use(express.json());
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
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            createdAt: new Date()
        };

        await messagesCollection.insertOne(message);

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


// Log visitor activity
app.post("/api/visit", async (req, res) => {

    try {

        const visit = {
            timestamp: new Date(),
            browser: req.headers["user-agent"],
            ip: req.ip
        };

        await visitsCollection.insertOne(visit);

        res.json({
            success: true,
            message: "Visitor logged successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to log visitor."
        });
    }
});


// Visitor statistics
app.get("/api/visit/stats", async (req, res) => {

    try {

        const totalVisits = await visitsCollection.countDocuments();

        const recentVisits = await visitsCollection
            .find()
            .sort({ timestamp: -1 })
            .limit(5)
            .toArray();


        res.json({
            totalVisits,
            recentVisits
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch visitor statistics."
        });
    }
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});