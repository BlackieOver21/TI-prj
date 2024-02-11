const client = require('./db_conn');

async function addUser(username, email, password) {
  try {
    // Connect to the database pool
    const client = await pool.connect();

    // Insert the new user into the database
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );

    // Release the client back to the pool
    client.release();

    // Return the newly inserted user
    return result.rows[0];
  } catch (error) {
    // Handle any errors
    console.error('Error adding user:', error.message);
    throw error;
  }
}

async function CheckPassword(login, haslo) {
  try {
    // Retrieve user's information from the database
    const result = await client.query('SELECT username, password FROM users WHERE username = $1', [login]);

    // Check if a user with the given username exists
    if (result.rows.length === 0) {
      return false; // User does not exist
    }

    // Retrieve the password from the database
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

        // Access the inserted row (if needed)
        console.log('Inserted row:', result.rows[0]);

        return(0); // You may want to return the inserted data or an indicator of success
      }).catch((error) => {
        console.error('Error executing query:', error);
        // Handle the error here
        return(1); // Rethrow the error for handling at a higher level
      })
}

async function AddPreference(preference, username) {
  return new Promise((resolve, reject) => {
    var params = []
    var query = ``;
    if(preference.change == 'dot'){
      params = [username, preference.dx1, preference.dx2, preference.dx3, preference.dy1, preference.dy2, preference.dy3];
      query = `UPDATE TI_prj.users
                    SET dot_x1 = $2, dot_x2 = $3, dot_x3 = $4, dot_y1 = $5, dot_y2 = $6, dot_y3 = $7
                    WHERE users.username = $1;`
    }
    if(preference.change == 'curve'){
      params = [username, preference.cl];
      query = `UPDATE TI_prj.users
                    SET curve_level = $2
                    WHERE users.username = $1;`
    }
    if(preference.change == 'pascal'){
      params = [username, preference.pl];
      query = `UPDATE TI_prj.users
                    SET pascal_level = $2
                    WHERE users.username = $1;`
    }

    console.log(query);

    client.query(query, params)
      .then((result) => {

        // Access the inserted row (if needed)
        console.log('Inserted row:', result.rows[0]);

        resolve(true); // You may want to return the inserted data or an indicator of success
        return true;
      }).catch((error) => {
        console.error('Error executing query:', error);
        // Handle the error here
        reject(error); // Rethrow the error for handling at a higher level
      })
  });
}

module.exports = {
    addUser,
    CheckPassword,
    RegisterNewUser,
    AddPreference
};