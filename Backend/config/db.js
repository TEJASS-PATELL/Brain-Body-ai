const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

let connection;

const connectDB = async () => {
    if (connection) return connection; 

    try {
        connection = await mysql.createConnection({  
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DBPORT
        });

        console.log("MySQL Connection Established");
        return connection;
    } catch (err) {
        console.error("MySQL Connection Error:", err);
        throw err;
    }
};

module.exports = connectDB;
