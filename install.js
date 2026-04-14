const mysql = require("mysql"); // Databas
require("dotenv").config(); // Miljövariabler

// Anslutningsinställningar genom miljövariabler
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Anlsuter till databasen
connection.connect((err) => {
    // Om något fel uppstår
    if (err) {
        console.log("Misslyckades med att ansluta till databasen: ", err);
        return;
    }
    // Om anslutningen gick bra
    console.log("Ansluten till databasen " + connection.config.database + "!");
});

// SQL-fråga skapa tabell
// Om den redan existerar
connection.query("DROP TABLE IF EXISTS experience;", (error, results) => {
    if (error) throw error;
    console.log("Tabellen 'experience' raderad! (om den existerade redan)");
});
// Skapar tabellen
connection.query(`CREATE TABLE experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL);`, (error, results) => {
    if (error) throw error;
    console.log("Tabellen 'experience' skapad!");
});

connection.end();