const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Använder miljövariabler för port eller port 3000
const cors = require("cors"); // Cors som tillåter cross-origins requests
const mysql = require("mysql"); // Mysql som databas
require("dotenv").config(); // För att använda miljövariablerna

app.use(cors());
app.use(express.json()); // Middleware för att läsa JSON-data i requests

// Databasanslutningen
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

// Ansluter till databasen
connection.connect((error) => {
    if (error) {
        console.log("Misslyckades med att ansluta till databasen: " + error);
        return;
    }

    console.log("Ansluten till databasen!");
});

// Routes

app.get("/api", (req, res) => {
    res.json({ message: "Välkommen till detta API!" });
});

// Route för att hämta alla arbetserfarenheter
app.get("/api/cv/experience", (req, res) => {
    //res.json({ message: "Hämtar jobberfarenheter" });

    // Hämtar in allt från tabellen experience inom databasen
    connection.query(`SELECT * FROM experience;`, (error, results) => {
        if (error) {
            res.status(500).json({ error: "Något gick fel: " + error });
            return;
        }

        // Visar resultatet i konsollen av frågan
        console.log(results);

        // Om inga tidigare "jobb" hittades
        if (results.length === 0) {
            res.status(404).json({ message: "Inga jobberfarenheter hittades" });
        } else {
            res.json(results);
        }
    });
});

// Route för att lägga till en arbetserfarenhet
app.post("/api/cv/experience", (req, res) => {
    let companyName = req.body.companyName;
    let jobTitle = req.body.jobTitle;
    let location = req.body.location;
    let description = req.body.description;

    // Felmeddelande struktur
    let errors = {
        message: "",
        detail: "",
        https_response: {}
    };

    // Om något av fälten inte är angivna körs inte den senare sql-frågan
    if (!companyName || !jobTitle || !location || !description) {

        // Error-meddelande
        errors.message = "Fel inmatade data";
        errors.detail = "Inkludera korrekta värden i fälten: companyName, jobTitle, location, description";

        // Respons-kod
        errors.https_response.message = "Bad Request";
        errors.https_response.code = 400;

        res.status(400).json(errors);
        return;
    }

    // Infogar data i databasen
    connection.query(
        `INSERT INTO experience (companyName, jobTitle, location, description) VALUES (?, ?, ?, ?);`, [companyName, jobTitle, location, description], (error, results) => {
            if (error) {
                res.status(500).json({ error: "Något gick fel: " + error });
                return;
            }

            // Visar resultatet av insättningen
            console.log("Fråga kördes: " + results);

            // Ett objekt med det nya tillagda jobbet
            let newExperience = {
                companyName: companyName,
                jobTitle: jobTitle,
                location: location,
                description: description
            };
            res.status(201).json({ message: "Ny arbetserfarenhet tillagd!", newExperience });
        });
});

// För att uppdatera en arbetserfarenhet
app.put("/api/cv/experience/:id", (req, res) => {
    res.json({ message: "Uppdaterade arbetserfarenheten: " + req.params.id });
});

// För att radera en arbetserfarenhet
app.delete("/api/cv/experience/:id", (req, res) => {
    const id = req.params.id;

    // Fråga för att radera en arbetserfarenhet genom ett id
    connection.query(
        `DELETE FROM experience WHERE id = ?;`, [id], (error, results) => {
            if (error) {
                res.status(404).json({ error: "Ingen arbetserfarenhet hittades med id: " + id + error });
            }
        }
    )
    res.json({ message: "Raderat arbetserfarenheten med ID: " + id });
});

// Startar servern
app.listen(port, () => {
    console.log("Servern startade på port: " + port);
    console.log("Länk: http://localhost:" + port);
});