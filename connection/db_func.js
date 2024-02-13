const { user } = require('pg/lib/defaults');
const client = require('./db_conn');

const { Pool } = require('pg');

// Create a PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to add a new user to the database - pooling, doesnt work, delete later
async function addUser(username, password) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO TI_prj.users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );

    client.release();

    return result.rows[0];
  } catch (error) {
    console.error('Error adding user:', error.message);
    throw error;
  }
}


async function CheckPassword(login, haslo) {
  try {
    client.connect();
    const result = await client.query('SELECT username, password FROM TI_prj.users WHERE username = $1', [login]);

    if (result.rows.length === 0) {
      return false;
    }

    const Password = result.rows[0].password;
    console.log(haslo, Password);
    return haslo == Password;
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  }
}

function RegisterNewUser(username, password) {

  const params = [username, password];
  console.log(params);
  const query = `INSERT INTO TI_prj.users (username, password) VALUES ($1, $2);`

  client.query(query, params)
      .then((result) => {

        console.log('Inserted row:', result.rows[0]);

        return(0); 
      }).catch((error) => {
        console.error('Error executing query:', error);
        return(1); // Rethrow the error for handling at a higher level
      })
}

function AddPreference(preference, username) {
	console.log(preference);
var params = [];
    var query = ``;
    if(preference.change == 'dot'){
      params = [username, 
        parseInt(preference.dx1), 
        parseInt(preference.dx2), 
        parseInt(preference.dx3), 
        parseInt(preference.dy1), 
        parseInt(preference.dy2), 
        parseInt(preference.dy3)
      ];
      query = `UPDATE TI_prj.users
                    SET dot_x1 = $2, dot_x2 = $3, dot_x3 = $4, dot_y1 = $5, dot_y2 = $6, dot_y3 = $7
                    WHERE users.username = $1;`
    }
    if(preference.change == 'curve'){
      params = [username, parseInt(preference.dcl)];
      query = `UPDATE TI_prj.users
                    SET curve_level = $2
                    WHERE users.username = $1;`
    }
    if(preference.change == 'pascal'){
      params = [username, parseInt(preference.dpl)];
      query = `UPDATE TI_prj.users
                    SET pascal_level = $2
                    WHERE users.username = $1;`
    }

    console.log(query, params);

    return client.query(query, params)
      .then(result => {

        console.log('Inserted row:', result.rows[0]);

       // resolve(true); 
        return result;
      }).catch((error) => {
        console.error('Error executing query:', error);
        //reject(error);
	      return error;
      })
 }


function GetPreference(username) {
  const params = [username];

  const query = `SELECT * FROM TI_prj.users
  WHERE username = $1`;

  return client.query(query, params)
    .then(result => {
      console.log(result.rows);
        return result.rows;
    })
    .catch(error => {
      console.error('Error executing query:', error);
    });
 }

module.exports = {
    addUser,
    CheckPassword,
    RegisterNewUser,
    AddPreference,
    GetPreference
};
