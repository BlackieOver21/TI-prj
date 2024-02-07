const client = require('./db_conn');

const AddUser = (login, haslo) => {

    const params = [login, haslo];

    const query = `SELECT * FROM dodaj_login_uzytkownika ($1, $2)`;

    return client.query(query, params);
}

const CheckPassword = (login, haslo) => {

    const params = [login, haslo]; 

    const query = `SELECT * FROM sprawdz_haslo($1, $2)`;

    return client.query(query, params);
}

const ChangePassword = (login, haslo1, haslo2) => {
  
    const params = [login, haslo1, haslo2]; 

    const query = `SELECT * FROM zmien_haslo($1, $2, $3)`;

    return client.query(query, params);
}

async function RegisterNewUser(user) {
  return new Promise((resolve, reject) => {
    const params = [user.imie, user.nazwisko, user.pesel, user.login, user.haslo];
    const query = `select * from wstawianie_pacjenta($1, $2, $3, $4, $5);`

    client.query(query, params)
      .then((result) => {

        // Access the inserted row (if needed)
        console.log('Inserted row:', result.rows[0].wstawianie_pacjenta);

        resolve(result.rows[0].wstawianie_pacjenta); // You may want to return the inserted data or an indicator of success
      }).catch((error) => {
        console.error('Error executing query:', error);
        // Handle the error here
        reject(error); // Rethrow the error for handling at a higher level
      })
  });
}

module.exports = {
    AddUser,
    CheckPassword,
    ChangePassword,
    RegisterNewUser
};