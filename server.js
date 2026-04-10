const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

app.use(cors());
app.use(express.json()); // Middleware för att läsa JSON-data i requests

// Databasanslutningen
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.log("Misslyckades med att ansluta till databasen: " + err);
        return;
    }

    console.log("Ansluten till databasen!");
});

// Routes
app.get("/api", (req, res) => {
    res.json({ message: "Välkommen till detta API!" });
});

app.get("/api/cv/experience", (req, res) => {
    res.json({ message: "Hämta jobberfarenheter" });

    connection.query(`SELECT * FROM experience;`, (err, results) => {
        if (err) {
            res.status(500).json({ error: "Något gick fel: " + err })
            console.log(results);
        }
    });
});

app.post("/api/cv/experience", (req, res) => {
    let id = req.body.id;
    let companyName = req.body.companyName;
    let jobTitle = req.body.jobTitle;
    let location = req.body.location;
    let description = req.body.description;

    // Felmeddelanden struktur
    let errors = {
        message: "",
        detail: "",
        https_response: {

        }
    };

    if (!id || !companyName || !jobTitle || !location || !description) {

        // Error-meddelande
        errors.message = "Fel inmatade data";
        errors.detail = "Inkludera korrekta värden i alla fälten: id, companyName, jobTitle, location, description";

        // Respons-kod
        errors.https_response.message = "Bad Request";
        errors.https_response.code = 400;

        res.status(400).json(errors);
        //return;
    }

    let newExperience = {
        id: id,
        companyName: companyName,
        jobTitle: jobTitle,
        location: location,
        description: description
    };

    res.json({ message: "Ny arbetserfarenhet tillagd!", newExperience });
});

app.put("/api/cv/experience/:id", (req, res) => {
    res.json({ message: "Uppdaterade arbetserfarenheten: " + req.params.id });
});

app.delete("/api/cv/experience/:id", (req, res) => {
    res.json({ message: "Raderat arbetserfarenheten: " + req.params.id });
});

// Startar servern
app.listen(port, () => {
    console.log("Servern startade på port: " + port);
    console.log("Länk: http://localhost:" + port);
});