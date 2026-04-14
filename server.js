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
    database: process.env.DB_DATABASE
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

app.get("/", (req, res) => {
    res.json({ message: "Välkommen till detta API!" });
});

// Route för att hämta alla arbetserfarenheter
app.get("/workexperience", (req, res) => {
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

// Route för att hämta en specifik arbetserfarenhet genom id
app.get("/workexperience/:id", (req, res) => {
    //res.json({ message: "Hämtar jobberfarenheter" });

    const id = req.params.id;

    // Hämtar in allt från tabellen experience inom databasen
    connection.query(`SELECT * FROM experience WHERE id = ?;`, [id], (error, results) => {
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
app.post("/workexperience", (req, res) => {
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
app.put("/workexperience/:id", (req, res) => {
    const id = req.params.id;
    const { companyName, jobTitle, location, description } = req.body;

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
        errors.detail = "Inkludera data i alla fält: companyName, jobTitle, location, description";

        // Respons-kod
        errors.https_response.message = "Bad Request";
        errors.https_response.code = 400;

        res.status(400).json(errors);
        return;
    }

    // För att uppdatera en redan befintlig "arbetserfarenhet" genom id i databasen
    connection.query(
        `UPDATE experience 
            SET companyName = ?,
            jobTitle = ?,
            location = ?,
            description = ?
            WHERE id = ?;`, [companyName, jobTitle, location, description, id], (error, results) => {

            // Om något skulle gå fel
            if (error) {
                res.status(500).json({ error: "Något gick fel: " + error });
                return;
            }

            // Om fel angivet ID försöker uppdateras
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Ingen arbetserfarenhet hittades med id: " + id });
                return;
            }

            // Om det lyckades
            res.json({
                message: "Uppdaterade arbetserfarenheten: ",
                updated: {
                    id,
                    companyName,
                    jobTitle,
                    location,
                    description
                }
            });
        });
});

// För att radera en arbetserfarenhet
app.delete("/workexperience/:id", (req, res) => {
    const id = req.params.id;

    // Fråga för att radera en arbetserfarenhet genom ett id
    connection.query(
        `DELETE FROM experience WHERE id = ?;`, [id], (error, results) => {

            // Om något skulle gå fel
            if (error) {
                res.status(500).json({ error: "Något gick fel: " + error });
                return;
            }

            // Om fel angivet ID försöker raderas
            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Ingen arbetserfarenhet hittades med id: " + id });
                return;
            }

            // Om raderingen lyckades
            res.json({ message: "Raderat arbetserfarenheten med ID: " + id });
        }
    )
});

// Startar servern
app.listen(port, () => {
    console.log("Servern startade på port: " + port);
    console.log("Länk: http://localhost:" + port);
});