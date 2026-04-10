const mysql = require("mysql");
require("dotenv").config();

// Anslutningsinställningar
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.log("Misslyckades med att ansluta till databasen: ", err);
        return;
    }

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
    companyName VARCHAR(255) NOT NULL,
    jobTitle VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL);`, (error, results) => {
    if (error) throw error;
    console.log("Tabellen 'experience' skapad!");
});

connection.end();