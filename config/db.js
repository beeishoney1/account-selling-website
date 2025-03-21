const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    ca: fs.readFileSync('./config/ca.pem'), // Correct path for backend/config/ca.pem
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Database Connection Error:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = connection;