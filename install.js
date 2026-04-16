const { Client } = require("pg"); // Postgresql
require("dotenv").config(); // Miljövariabler

// Anslutningsinställningar genom miljövariabler
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

// Ansluter till databasen och visar error om det misslyckas, annars skapas tabellen och data läggs till
client.connect((error) => {
    if (error) {
        console.log('Misslyckades med att ansluta till databasen: ', error);
        return;
    } else {
        console.log('Anslutningen till databasen lyckades!');
        createTable();
    }
});

async function createTable() {
    try {
        await client.query("DROP TABLE IF EXISTS experience;");
        console.log("Tabellen 'experience' raderad! (om den existerade redan)");

        await client.query(`CREATE TABLE experience (
            id SERIAL PRIMARY KEY,
            company_name TEXT NOT NULL,
            job_title TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL);`);
        console.log("Tabellen 'experience' skapad!");
        await client.query(`INSERT INTO experience (company_name, job_title, location, description) VALUES
            ('Storsjöbadet', 'Badhustekniker', 'Östersund, Sverige', 'Såg över badhusanläggningen och åtgärdade fel.');`);
        console.log("Exempeldata infogad i 'experience' tabellen!");
    } catch (error) {
        console.error("Fel när tabellen skapades: ", error);
    } finally {
        await client.end();
    }
}