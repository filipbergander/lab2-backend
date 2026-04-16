const { Pool } = require("pg"); // Postgresql
require("dotenv").config(); // För att använda miljövariablerna
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Använder miljövariabler för port eller port 3000
const cors = require("cors"); // Cors som tillåter cross-origins requests

app.use(cors());
app.use(express.json()); // Middleware för att läsa JSON-data i requests

// Pool med flera anslutningar
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((error) => {
    if (error) {
        console.error("Misslyckades med att skapa pool: " + error);
        return;
    } else {
        console.log("Ansluten till databasen via pool!");
    }
});
// Routes

// Startsidan
app.get("/", async(req, res) => {
    try {
        res.json({ message: "Välkommen till detta API!" });
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att hämta alla arbetserfarenheter
app.get("/workexperience", async(req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM experience;`, (error, results) => {
            if (error) {
                res.status(500).json({ error: "Något gick fel: " + error });
                return;
            }
            res.json(results.rows);
            console.log(results);
            // Om det inte fanns några tidigare arbetserfarenheter
            if (results.rows.length === 0) {
                res.status(404).json({ message: "Inga jobberfarenheter hittades" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att hämta en specifik arbetserfarenhet genom id
app.get("/workexperience/:id", async(req, res) => {
    try {
        let id = req.params.id; // Det specifika id som ska skickas med i frågan
        const result = await pool.query(`SELECT * FROM experience WHERE id=$1;`, [id], (error, results) => {
            if (error) {
                res.status(500).json({ error: "Något gick fel när ett specifikt id skulle hämtas: " + error });
                return;
            }
            res.json(results.rows[0]);
            console.log(results);

            // Om ingenting hittades med det specifika id
            if (results.rows.length === 0) {
                res.status(404).json({ message: `Inga jobberfarenheter hittades med id:  + ${id}` });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att lägga till en ny arbetserfarenhet
app.post("/workexperience", async(req, res) => {
    try {
        let company_name = req.body.company_name;
        let job_title = req.body.job_title;
        let location = req.body.location;
        let description = req.body.description;
        if (!company_name && !job_title && !location && !description) {
            res.status(400).json({ error: "Inkludera korrekta värden i alla fälten: company_name, job_title, location, description" });
            return;
        }
        const result = await pool.query(
            "INSERT INTO experience (company_name, job_title, location, description) VALUES ($1, $2, $3, $4)", [company_name, job_title, location, description], (error, results) => {
                if (error) {
                    res.status(500).json({ error: "Något gick fel: " + error });
                    return;
                }
                console.log("Frågan kördes: " + results);
                let newExperience = {
                    company_name: company_name,
                    job_title: job_title,
                    location: location,
                    description: description
                };
                res.status(201).json({ message: "Ny arbetserfarenhet tillagd!", newExperience });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att uppdatera en arbetserfarenhet
app.put("/workexperience/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const { company_name, job_title, location, description } = req.body;

        const result = await pool.query(
            "UPDATE experience SET company_name = $1, job_title = $2, location = $3, description = $4 WHERE id = $5", [company_name, job_title, location, description, id], (error, results) => {
                if (error) {
                    res.status(500).json({ error: "Något gick fel: " + error });
                    return;
                }
                if (results.rowCount === 0) {
                    res.status(404).json({ error: "Ingen arbetserfarenhet hittades med id: " + id });
                    return;
                }
                res.json({
                    message: `Uppdaterade arbetserfarenheten: ${id}`,
                    updated: {
                        id,
                        company_name,
                        job_title,
                        location,
                        description
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att radera en arbetserfarenhet
app.delete("/workexperience/:id", async(req, res) => {

    try {
        const id = req.params.id;
        const result = await pool.query(
            "DELETE FROM experience WHERE id = $1", [id]);
        // Om det inte finns något arbetserfarenhet med just det specifika id
        if (result.rowCount === 0) {
            return res.status(404).json({ error: `Ingen arbetserfarenhet hittades med id ${id}` });
        }
        res.json({ message: "Raderat arbetserfarenheten med id: " + id });
    } catch (error) {
        res.status(500).json({ error: `Något gick fel när kursen ${id} skulle raderas: ` + error });
    }
});

// Starta applikation
app.listen(port, () => {
    console.log("Servern startade på port: " + port);
    console.log("Länk: http://localhost:" + port);
});