const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Middleware för att läsa JSON-data i requests

// Routes
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to this API service!" });
});

app.get("/api/workexperience", (req, res) => {
    res.json({ message: "Get work-experience DATA" });
});

app.post("/api/workexperience", (req, res) => {
    let experience = req.body.experience;
    let company = req.body.company;

    let errors = {
        message: "",
        detail: "",
        https_response: {

        }
    };

    if (!experience || !company) {

        // Error-meddelande
        errors.message = "Data is missing";
        errors.detail = "Include complete data for experience and company";

        // Respons-kod
        errors.https_response.message = "Bad Request";
        errors.https_response.code = 400;

        res.status(400).json(errors);
        return;
    }

    let newExperience = {
        experience: experience,
        company: company
    };

    res.json({ message: "Add work-experience DATA", newExperience });
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