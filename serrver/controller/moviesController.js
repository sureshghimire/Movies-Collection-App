
//import mysql

const mysql = require('mysql');

//Create Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


// Display all the records
exports.showAll = (req, res) => {

    //get connection
    pool.getConnection((error, connection) => {

        //make query on database
        connection.query('SELECT * From movies', (error, rows) => {
            //relase connection
            connection.release()

            //render the home pae
            let removedMovie = req.query.removed;
            console.log(removedMovie)
            res.render('home', { rows, removedMovie })
        })
    })

}

//Find records using title and year
exports.find = (req, res) => {
    //get the search value from the front end
    let search_item = req.body.search;
    console.log(search_item)

    //get connection
    pool.getConnection((error, connection) => {
        //make query on database
        connection.query('SELECT * FROM movies WHERE title LIKE ? OR year LIKE ?', ['%' + search_item + '%', '%' + search_item + '%'], (error, rows) => {
            //release connection
            connection.release();

            res.render('home', { rows })
        })
    })

}

//Add new movie 

//Get form to add new movie record
exports.addForm = (req, res) => {
    //display the form
    res.render('add_movie')

}

//Post: create new record
exports.create = (req, res) => {
    //get the request from the body
    const { title, year, description } = req.body;

    //get connection from the pool
    pool.getConnection((error, connection) => {
        if (error) throw error;

        //verify connection
        console.log('Connected at', connection.threadId);

        //make query on existing connection
        connection.query('INSERT INTO movies SET title =?, year=?', [title, year, description], (error, rows) => {

            //relase connection
            connection.release();

            if (!error) {
                res.render('add_movie', { alert: 'Added sucessfully' })
            } else {
                console.log(error)
            }
            //verify connecteion after release
            console.log('Connected at:', connection.threadId)
        })
    })
}


//Get edit from including records on it
exports.edit = (req, res) => {
    //get the id from the request body
    const { id } = req.params;
    //get connection from the pool
    pool.getConnection((error, connection) => {
        if (error) throw error;

        //make query in connection
        connection.query('SELECT * FROM movies WHERE id =?', id, (error, rows) => {
            //release connection
            connection.release();
            if (!error) {
                res.render('edit_form', { rows })
            } else {
                res.send(error)
            }
        })
    })

}

//POST: Update the edited record and save on database
exports.update = (req, res) => {

    const { title, year, description } = req.body;

    //get connection from the pool
    pool.getConnection((error, connection) => {
        if (error) throw error;

        //make query
        connection.query('UPDATE movies SET title =?, year =? ,description = ? WHERE id = ?', [title, year, description, req.params.id], (error, rows) => {

            if (!error) {

                //make query in connection
                connection.query('SELECT * FROM movies WHERE id =?', req.params.id, (error, rows) => {
                    //release connection
                    connection.release();
                    if (!error) {
                        res.render('edit_form', { rows, alert: `${title} has been updated` })
                    } else {
                        res.send(error)
                    }
                })


                //res.render('edit_form',{alert:`Movie of id: ${req.params} has been updated`})
            } else {
                res.send(error)
            }
        })
    })

}

//Delete the existing record
exports.remove = (req, res) => {
    //get the id
    const { id } = req.params;

    /*
    // Delete a record

  // User the connection
  // connection.query('DELETE FROM movies WHERE id = ?', [req.params.id], (err, rows) => {

  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);

  // });



    */

    //get the connection from the pool
    pool.getConnection((error, connection) => {
        if (error) throw error;

        //make query on connected database
        connection.query('DELETE FROM movies where id =?', req.params.id, (error, rows) => {
            //release connection
            connection.release()

            if (!error) {
                let removedMovie = encodeURIComponent('User successeflly removed.');
                res.redirect('/?removed=' + removedMovie);

            } else {
                res.send(error)
            }
        })
    })

}

//View more about the record
exports.view = (req, res) => {
    //get connection
    pool.getConnection((error, connection)=>{
        if(error) throw error;

        //get query from database
        connection.query('SELECT * FROM movies WHERE id =?',req.params.id, (error, rows)=>{
            //release connection
            if(!error){
                res.render('view_record', {rows})
            }else{
                res.send(error)
            }
        })
    })
 }