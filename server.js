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

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Forbidden: Invalid token');
    }
    req.user = user;
    next();
  });
}

function authenticateTokenPracownik(req, res, next) {
  const token = req.cookies.sessionToken;
  console.log(token);
  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Forbidden: Invalid token');
    }
    if (user.group < 3) {
      return res.status(403).send('Forbidden: Invalid access');
    }
    req.user = user;
    next();
  });
}

function authenticateTokenLekarz(req, res, next) {
  const token = req.cookies.sessionToken;
  console.log(token);
  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, secretKey, (err, user) => {
    console.log(user);
    if (err) {
      return res.status(403).send('Forbidden: Invalid token');
    }
    if (user.group != 2) {
      return res.status(403).send('Forbidden: Invalid access');
    }
    req.user = user;
    next();
  });
}
const app = express();

// Use bodyParser middleware to parse JSON in request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Define a route that handles POST requests
app.post('/newuser', (req, res) => {
  const data = req.body;

  console.log('Received POST request data:', data);

  var resp = logins.AddUser(data.login, data.pass);
  console.log(resp);

  res.status(200).send('POST request received successfully');
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
  
    console.log('Received POST request data:', req.body);

    var resp = logins.CheckPassword(data.login, data.pass);

    resp.then(result => {
        console.log('Query result:', result.rows);
        if(result.rows[0].sprawdz_haslo != 0){
            data['group'] = result.rows[0].sprawdz_haslo;
            const sessionToken = jwt.sign(data, secretKey, { expiresIn: '1h' });
            //storeSessionData(sessionToken, data);
            console.log(result.rows[0].sprawdz_haslo);
            res.cookie('sessionToken', sessionToken, { httpOnly: true });
            res.cookie('login', data.login, { maxAge: 900000, httpOnly: true });
           // res.status(200).send('Request completed - logged in as ' + data.login + '.\n');
            if (result.rows[0].sprawdz_haslo == 1) res.redirect('/pacjent_loggedin');
            if (result.rows[0].sprawdz_haslo == 2) res.redirect('/lekarz_loggedin');
            if (result.rows[0].sprawdz_haslo >= 3) res.redirect('/pracownik_loggedin');
        } else {
            res.status(200).send('Request denied - password ' + data.pass + ' is incorrect.\n');
        }
      })
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
          res.redirect(302, 'http://pascal.fis.agh.edu.pl/~1bersutskyi/prj/login.html');
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

app.get('/main_page', authenticateTokenPracownik, (req, res) => {
  fs.readFile("Strona/main.html", 'utf8', (err, data) => {
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

app.get('/info', authenticateTokenPracownik, (req, res) => {
  fs.readFile("Strona/sierpinski.html", 'utf8', (err, data) => {
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

app.get('/demo', authenticateTokenPracownik, (req, res) => {
  fs.readFile("Strona/demo.html", 'utf8', (err, data) => {
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

app.post('/page_1', (req, res) => {
  const data = req.body;
  
  console.log('Received POST request data:', req.body);

  logins.AddDiagnoza(data)
  .then(() => {
    console.log('Dodano diagnoze.');

   })
  .catch(err => {
    console.error('Error ', err);
  });
});

app.post('/page_2', authenticateTokenUser, (req, res) => {
});


const port = 8013;
const hostname = 'pascal.fis.agh.edu.pl';

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});