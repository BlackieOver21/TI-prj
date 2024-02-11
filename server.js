// Import the HTTP module
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const logins = require('./connection/db_func');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });        // NIEPOTRZEBNE (chyba?)
  res.end('Hello, World!\n');
});

const secretKey = 'ThisIsMySecretKey. Or something...';

function authenticateTokenUser(req, res, next) {
  const token = req.cookies.sessionToken;
  console.log(token);
  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, username) => {
    if (err) {
      return res.status(403).send('Forbidden: Invalid token');
    }
    req.username = username;
    next();
  });
}

const app = express();

// Use bodyParser middleware to parse JSON in request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'Strona')));

// Define a route that handles POST requests
// app.post('/newuser', (req, res) => {
//   const data = req.body;

//   console.log('Received POST request data:', data);
//   console.log('Received POST request password and login:', data.username, data.password);

//   var resp = logins.RegisterNewUser(data.username, data.password);

//   if(resp == 0){
//           const sessionToken = jwt.sign(data, secretKey, { expiresIn: '1h' });
//           //storeSessionData(sessionToken, data);
//           res.cookie('sessionToken', sessionToken, { httpOnly: true });
//           res.cookie('login', data.username, { maxAge: 900000, httpOnly: true });
//           //res.status(200).send('Request completed - logged in as ' + data.login + '.\n');
//           res.redirect('/main_page');
//       } else {
//           res.status(200).send('Request denied - password ' + data.password + ' is incorrect.\n');
//     }
// });

app.post('/newuser', async (req, res) => {
  try {
    const newUser = await addUser(req.body.username, req.body.password);
    console.log('New user added:', newUser);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the database pool when done
    await pool.end();
  }
});


app.post('/chkpwd', (req, res) => {
    const data = req.body;
  
    console.log('Received POST request data:', data);

    var resp = logins.CheckPassword(data.login, data.pass);

    resp.then(result => {
        console.log('Query result:', result.rows);
        res.status(200).send('POST request received successfully\n' + result.rows);
      })
});

app.post('/chgpwd', (req, res) => {
    const data = req.body;
  
    console.log('Received POST request data:', data);

    var resp = logins.ChangePassword(data.login, data.pass1, data.pass2);

    resp.then(result => {
        console.log('Query result:', result.rows);
        res.status(200).send('POST request received successfully\n' + result.rows);
      })
});

app.post('/login', (req, res) => {
    const data = req.body;
  
    console.log('Received POST request data:', data);
    console.log('Received POST request password and login:', data.username, data.password);

    var resp = logins.CheckPassword(data.username, data.password);

    resp.then(result => {
        console.log('Query result:', result);
        if(result){
            const sessionToken = jwt.sign(data, secretKey, { expiresIn: '1h' });
            //storeSessionData(sessionToken, data);
            res.cookie('sessionToken', sessionToken, { httpOnly: true });
            res.cookie('login', data.username, { maxAge: 900000, httpOnly: true });
            //res.status(200).send('Request completed - logged in as ' + data.login + '.\n');
            res.redirect('/main_page');
        } else {
            res.status(200).send('Request denied - password ' + data.password + ' is incorrect.\n');
        }
      })
});

app.post('/logout', (req, res) => {
  const data = req.body;

  console.log('Received POST request LOGOUT data:', data);

  var resp = logins.CheckPassword(data.username, data.password);

  const sessionToken = jwt.sign(data, secretKey, { expiresIn: '1h' });
  //storeSessionData(sessionToken, data);
  res.cookie('sessionToken', sessionToken, { httpOnly: true });
  res.cookie('login', data.username, { maxAge: 900000, httpOnly: true });
  //res.status(200).send('Request completed - logged in as ' + data.login + '.\n');
  res.redirect('/main_page');
});

app.post('/user_register', (req, res) => {
  const data = req.body;

  console.log('Received POST request data:', data);

  //var resp = logins.RegisterNewUser(data);

  logins.RegisterNewUser(data)
      .then((result) => {
        console.log(result);
        if(result == 0){
          //res.status(200).send('Request completed - new user registered.\n');
          res.redirect(302, '/');
          //alert('Request completed - new user registered.\n');
        }else{
          //res.status(200).send('Request denied - nie udało się zarejestrować użytkownika.\n');
          res.redirect(302, 'http://pascal.fis.agh.edu.pl/~1bersutskyi/prj/login.html');
          //alert('Request denied - nie udało się zarejestrować użytkownika.\n');
          //res.json({'result':'1'});
        }
      });
});

app.get('/fetching_terminy', authenticateTokenUser, (req, res) => {
  const parsedUrl = url.parse(req.url);
  console.log(parsedUrl);
  const queryString = querystring.parse(parsedUrl.query);
  console.log(queryString);
  const param1 = queryString.lekarz_id;
  const param2 = queryString.dzien;
  console.log(param1, param2);
  logins.fetchAllTerminy(param1, param2)
  .then(to_list => {

    //console.log(to_list);

    res.setHeader('Content-Type', 'application/json').json(to_list);
  });
});

app.get('/', (req, res) => {
//   const htmlFilePath = path.join(__dirname, 'Strona', 'main.html');
//   fs.readFile(htmlFilePath, 'utf8', (err, data) => {
//     if (err) {
//         console.log(err);
//         // If an error occurs, send a 500 Internal Server Error response
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('500 Internal Server Error');
//         return;
//     }

//     // Send the HTML content as the response
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(data);
// });
res.redirect('/main_page');
});

app.get('/main_page', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Strona', 'main.html');
  fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        // If an error occurs, send a 500 Internal Server Error response
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
    }

    // Send the HTML content as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
});
});

app.get('/info', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Strona', 'trojkat.html');
  fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
    }

    // Send the HTML content as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
});
});

app.get('/demo', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'Strona', 'demo.html');
  fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
    }

    // Send the HTML content as the response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
});
});

app.post('/save_preference', authenticateTokenUser, (req, res) => {
  const data = req.body;
  
  console.log('Received POST request data:', req.body);

  logins.AddPreference(data, req.cookies.login)
  .then(() => {
    console.log('Dodano preferencje.');
    res.redirect('/demo');
   })
  .catch(err => {
    console.error('Error ', err);
  });
});

const port =  process.env.PORT || 8080;
//const hostname = 'pascal.fis.agh.edu.pl';

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});