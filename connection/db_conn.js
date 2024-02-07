const { Client } = require('pg');

// Connection information for your PostgreSQL database
const connectionData = {
  user: 'u1bersutskyi',
  host: 'pascal.fis.agh.edu.pl',
  database: 'u1bersutskyi',
  password: '1bersutskyi',
  port: 5432, // Default PostgreSQL port
};

// Create a new PostgreSQL client
const client = new Client(connectionData);

// Connect to the PostgreSQL server
client.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');
    client.query('SET search_path TO project_2');
   })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database', err);
  });

module.exports = client;