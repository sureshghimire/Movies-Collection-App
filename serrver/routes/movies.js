
const express = require('express');
const router = require('express'). Router();
const moviesController = require('../controller/moviesController');


router.get('/', moviesController.showAll)     //show all movies records
router.post('/', moviesController.find)         //find the records using search term
router.get('/add', moviesController.addForm)   //get the form to add new record
router.post('/add', moviesController.create)   //create new movie records
router.get('/edit/:id', moviesController.edit)  //get the edit from to update the record from the table
router.post('/edit/:id', moviesController.update)   //post the edited record and update //use PUT method on POSTMAN
router.get('/remove/:id', moviesController.remove)      //remove the record from the database      //use DELETE method 
router.get('/:id', moviesController.view)       //view more details about the records

module.exports= router;


//************************************************************************************************************* */






