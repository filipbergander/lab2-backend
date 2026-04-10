const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());

// Routes
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to this API service!" });
});

app.get("/api/workexperience", (req, res) => {
    res.json({ message: "Get work-experience DATA" });
});

app.post("/api/workexperience", (req, res) => {
    res.json({ message: "Add work-experience DATA" });
});

app.put("/api/workexperience/:id", (req, res) => {
    res.json({ message: "Updated work-experience: " + req.params.id });
});

app.delete("/api/workexperience/:id", (req, res) => {
    res.json({ message: "Deleted work-experience: " + req.params.id });
});

// Startar servern
app.listen(port, () => {
    console.log("Server started on port: " + port);
    console.log("http://localhost:" + port);
});