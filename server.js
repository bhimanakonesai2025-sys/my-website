const express = require("express");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// Allow the server to receive JSON data
app.use(express.json());

// Serve files from the main project folder
app.use(express.static(__dirname));

// Serve the homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
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

// Receive and save messages
app.post("/api/messages", (req, res) => {

    const message = req.body;

    let messages = [];

    if (fs.existsSync("messages.json")) {
        const data = fs.readFileSync("messages.json");
        messages = JSON.parse(data);
    }

    messages.push(message);

    fs.writeFileSync(
        "messages.json",
        JSON.stringify(messages, null, 4)
    );

    console.log("New Message Received:");
    console.log(message);

    res.json({
        success: true,
        message: "Your message was saved successfully!"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});