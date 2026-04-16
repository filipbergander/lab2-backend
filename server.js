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
// Försöker ansluta till pool
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
    try { // Hämtar alla jobb i fallande ordning
        const result = await pool.query(`SELECT * FROM work_experience ORDER BY id DESC;`, (error, results) => {
            if (error) {
                res.status(500).json({ error: "Något gick fel: " + error });
            } // Om det inte fanns några tidigare arbetserfarenheter
            if (results.rows.length === 0) {
                return res.status(404).json({ message: "Inga jobberfarenheter hittades" });
            }
            const formattedResult = results.rows.map(row => ({
                id: row.id,
                company_name: row.company_name,
                job_title: row.job_title,
                location: row.location,
                description: row.description,
                start_date: row.start_date.toISOString().slice(0, 10), // Formaterar datumet till yyyy-mm-dd
                end_date: row.end_date.toISOString().slice(0, 10)
            }));

            res.json(formattedResult);
            console.log(formattedResult);
        });
    } catch (error) {
        res.status(500).json({ error: "Något gick fel: " + error });
    }
});

// För att hämta en specifik arbetserfarenhet genom id
app.get("/workexperience/:id", async(req, res) => {
    try {
        let id = req.params.id; // Det specifika id som ska skickas med i frågan
        const result = await pool.query(`SELECT * FROM work_experience WHERE id=$1;`, [id], (error, results) => {
            if (error) {
                res.status(500).json({ error: "Något gick fel när ett specifikt id skulle hämtas: " + error });
            }
            // Om ingenting hittades med det specifika id
            if (results.rows.length === 0) {
                return res.status(404).json({ message: `Inga jobberfarenheter hittades med id: ${id}` });
            }
            res.json(results.rows[0]);
            console.log(results);
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
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        if (!company_name && !job_title && !location && !description && !start_date && !end_date) {
            res.status(400).json({ error: "Inkludera korrekta värden i alla fälten: company_name, job_title, location, description, start_date, end_date" });
            return;
        }
        const result = await pool.query(
            "INSERT INTO work_experience (company_name, job_title, location, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)", [company_name, job_title, location, description, start_date, end_date], (error, results) => {
                if (error) {
                    res.status(500).json({ error: "Något gick fel: " + error });
                    return;
                }
                console.log("Frågan kördes: " + results);
                let newExperience = {
                    company_name: company_name,
                    job_title: job_title,
                    location: location,
                    description: description,
                    start_date: start_date,
                    end_date: end_date
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
        const { company_name, job_title, location, description, start_date, end_date } = req.body;

        const result = await pool.query(
            "UPDATE work_experience SET company_name = $1, job_title = $2, location = $3, description = $4, start_date = $5, end_date = $6 WHERE id = $7", [company_name, job_title, location, description, start_date, end_date, id], (error, results) => {
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
                        description,
                        start_date,
                        end_date
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
            "DELETE FROM work_experience WHERE id = $1", [id]);
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