import mysql from 'mysql'; // Import the MySQL library
import dotenv from 'dotenv'; // Import dotenv to load environment variables

dotenv.config(); // Load environment variables from .env file

// Create the MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Database host from .env
    user: process.env.DB_USER,       // Database username from .env
    password: process.env.DB_PASSWORD, // Database password from .env
    database: process.env.DB_NAME,   // Database name from .env
    port: process.env.DB_PORT,       // Database port from .env
});

// Test the MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message); // Log error details
        process.exit(1); // Exit the process if the database connection fails
    } else {
        console.log('Connected to MySQL database'); // Log success message
    }
});

// Handle database connection errors and reconnection
db.on('error', (err) => {
    console.error('Database error:', err.message);
    
    // If connection is lost, try to reconnect
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was lost. Attempting to reconnect...');
        db.connect((connectErr) => {
            if (connectErr) {
                console.error('Failed to reconnect:', connectErr.message);
            } else {
                console.log('Successfully reconnected to database');
            }
        });
    }
});

export default db; // Export the database connection for reuse
