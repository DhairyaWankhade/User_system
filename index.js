const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const User = require('./models/Users');
const url = "mongodb://0.0.0.0:27017";
const client = new MongoClient(url);  

const dbName = 'usersDB';

client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');

async function addUser(email, password) {
    const insertResult = await collection.insertOne({ "email": email , "password": password});
    console.log('Inserted documents =>', insertResult);
  
  }

  
  

const PORT = 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render("index");
});
app.get('/register', (req, res) => {
    res.render("register");
});
app.get('/login', (req, res) => {
    res.render("login");
});
app.get('/dashboard', (req, res) => {
    res.render("dashboard");
});


///POSTS REQUESTS HERE////
app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        email: email,
        password: password
    });

    addUser(email, password);
    res.send('Successfully Created User');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var result ;

    
    async function loginUser(email, password ) {
        await collection.findOne({email:email}, (err, foundResults) => {
            if(err) {
                console.log(err);
            }
            else {
                if (foundResults.password === password) {
                    result = true
                } else {
                    result = false
                }
            }
        });
    }

    loginUser(email,password);
    if (result===true)
        res.send("You logged in Successfully.")
    else
        res.send('Incorrect Email Or Password.')
});


app.listen(PORT, ()=> console.log("Server Started on port 3000"));