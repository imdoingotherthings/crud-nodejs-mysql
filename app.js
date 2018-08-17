const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const router = express.Router();
const myConnection = require('express-myconnection');
const method = require('method-override');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(method('_method'));

// creates the connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '<YOUR-PASSWORD>',
    database: '<YOUR-DATABASE-NAME'
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
    const data = req.body;
    connection.query('INSERT INTO users set ?', [data], (err, results, fields) => {
        if (err) throw err;
        console.log(req.body);
        res.redirect('/');
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
    let pass;
    if ('_method' in req.body) {
        data = req.body.idNum;
        newName = req.body.name;
        user = req.body.username;
        pass = req.body.password;
    }
    connection.query(`UPDATE users SET name = '${newName}', user_name = '${user}',
    pass = '${pass}' WHERE id = ${data}`, (err, results, fields) => {
        if (err) throw err;
        console.log(`Updated all parameters of ID: ${data}`);
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});