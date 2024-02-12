const { Client } = require('pg');

// Connection information for your PostgreSQL database
const connectionData = {
  user: 'default',
  host: 'ep-late-lab-a4bjepzz-pooler.us-east-1.aws.neon.tech',
  database: 'verceldb',
  password: 'c8qJe9lLXHfo',
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // Ignore self-signed certificates if necessary
    sslmode: 'require', // Use 'require' to enforce SSL/TLS encryption
  },
};

// Create a new PostgreSQL client
const client = new Client(connectionData);

// Connect to the PostgreSQL server
// client.connect()
//   .then(() => {
//     console.log('Connected to the PostgreSQL database');
//     //client.query('SET search_path TO TI_prj;');
//    })
//   .catch(err => {
//     console.error('Error connecting to PostgreSQL database', err);
//   });

module.exports = client;