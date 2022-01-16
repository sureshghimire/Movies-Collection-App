
//load all the required dependencies
const express = require('express');
const mysql = require('mysql');
let hbs= require('express-handlebars');


require('dotenv').config();
const app = express();
app.use(express.json());        //json body parser: don't forget to add this line
app.use(express.urlencoded({ extended: true }))     //to parse the strings to object
const PORT = process.env.PORT || 8888;

//set up static files
app.use(express.static('public'));      //make sure to create 'public' folder on root


//set up tempelating engine using express-handlebars
app.engine('hbs', hbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

// use route in express
const routes = require('./server/routes/movies')
app.use('/', routes)

//run app.js as backend server
app.listen(PORT, ()=>{console.log(`Server listening port ${PORT}...`)})


