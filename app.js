const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const router = express.Router();
const myConnection = require('express-myconnection');
const method = require('method-override');
const bcrypt = require('bcrypt-nodejs');
const { check, validationResult } = require('express-validator/check');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(method('_method'));

// creates the connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '<YOUR-PASSWORD>',
    database: '<YOUR-DATABASE>'
});

// connects the database
connection.connect();

// main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});


// get users
app.get('/user', (req, res) => {
    connection.query('SELECT * FROM users', (err, results, fields) => {
        if (err) throw err;
        res.send(results);
        res.redirect('/');
    });
});

// add user
app.post('/user', (req, res) => {
    const name = req.body.name;
    const username = req.body.user_name;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.pass, salt, null, (err, hash) => {
            connection.query(`INSERT INTO users (name, user_name, pass) 
            VALUES ('${name}', '${username}', '${req.body.pass = hash}')`, (err, results, fields) => {
                if (err) throw err;
                console.log(req.body.pass);
                res.redirect('/');
            });
        });
    });
});

// delete user by id 
app.post('/delete', (req, res) => {
    let data;
    if ('_method' in req.body) {
        data = req.body.idNum;
    }
    connection.query(`DELETE FROM users WHERE id = ${data}`, (err, results, fields) => {
        if (err) throw err;
        console.log(`Deleted ID: ${data}`);
        res.redirect('/');
    });
});

//update user data 
app.post('/update', (req, res) => {
    let data;
    let newName;
    let user;
    if ('_method' in req.body) {
        data = req.body.idNum;
        newName = req.body.name;
        user = req.body.username;
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, null, (err, hash) => {
            connection.query(`UPDATE users SET name = '${newName}', user_name = '${user}',
            pass = '${req.body.password = hash}' WHERE id = ${data}`, (err, results, fields) => {
                if (err) throw err;
                console.log(`Updated all parameters of ID: ${data}`);
                res.redirect('/');
            });
        });
    });
});

// login
app.post('/login', (req, res) => {
    let pass;
    let username;
    let userPass;
    if ('_method' in req.body) {
        pass = req.body.password; 
        username = req.body.username;
    }
    connection.query(`SELECT pass FROM users WHERE user_name = '${username}'`, (err, results, fields) => {
        if (err) throw err;
        userPass = results[0].pass;
        bcrypt.compare(pass, userPass , (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect('/');
        });
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});