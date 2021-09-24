const router = require("express").Router();
const mysql = require("mysql");
let hbs= require('express-handlebars');


require("dotenv").config();




//set up tempelating engine using express-handlebars
app.engine('hbs', hbs({extname: '.hbs'}));
app.set('view engine', 'hbs');


//navigate to home page
router.get('', (req, res)=>{
    res.render('home');
})

//GET route to view all the movies
// localhost:8888/movies
router.get("/", (req, res) => {
    try {
        // get database connection
        pool.getConnection((error, connection) => {
            try {
                //check connection status
                console.log(`Connected to id: ${connection.threadId}`);

                // add query
                connection.query("SELECT * FROM movies", (error, rows) => {
                    try {
                        connection.release(); //return the connection to the pool
                        res.status(200).send(rows);
                    } catch (error) {
                        res.status(500).json({ error: "Error on mysql syntax" });
                    }
                });
            } catch (error) {
                res.status(500).json({ error: "Error on connecting database" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

//post a new movie
router.post("/", (req, res) => {
    try {
        //get body request
        const new_movie = req.body;

        //get database pool connection
        pool.getConnection((error, connection) => {
            try {
                let query_stmt = "INSERT INTO movies SET ?";
                //make query on existing database connection
                connection.query(query_stmt, new_movie, (error, rows) => {
                    try {
                        //return connection back to pool
                        connection.release(); //relase the connection

                        // Return if the body is empty                    *** Need More Stuff *****

                        res.status(201).json({ message: `new movie has been add` });
                    } catch (error) {
                        res.status(401).json({ error: "mysql syntax error" });
                    }
                });
            } catch (error) {
                res.status(401).json({ error: error.toString() });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

//get a movie by id
//localhost: 8888/movies/:id
router.get("/:id", (req, res) => {
    try {
        //get movie id
        const movie_id = req.params.id;

        // get database connection
        pool.getConnection((error, connection) => {
            try {
                //check connection status
                console.log(`Connected to id: ${connection.threadId}`);

                // add query
                connection.query(
                    "SELECT * FROM movies where id = ?",
                    movie_id,
                    (error, rows) => {
                        try {
                            connection.release(); //return the connection to the pool

                            // add if condition to check if the movie of passing id exists or not         ** Need More Work   **
                            res.status(200).send(rows);
                        } catch (error) {
                            res.status(500).json({ error: "Error on mysql syntax" });
                        }
                    }
                );
            } catch (error) {
                res.status(500).json({ error: "Error on connecting database" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

//edit the movie by id      ****    NOT WORKING     ***
router.put("/", (req, res) => {
    try {
        //get database connection
        pool.getConnection((error, connection) => {
            try {
                // get the parameters from the body
                const { id, title, year, description } = req.body;

                //make query on existing connection

                let quey_statement =
                    "UPDATE movies SET title =?, year =?, description =? where id =?";
                connection.query(
                    quey_statement,
                    [title, year, description, id],
                    (error, rows) => {
                        try {
                            connection.release();
                            res
                                .status(201)
                                .send(`Movie with the title ${title} has been updated`);
                        } catch (error) {
                            res.status(404).json({ error: "mysql syntax error" });
                        }
                    }
                );
            } catch (error) {
                res.status(404).json({ error: error.toString() });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// delete the movie by id
router.delete("/:id", (req, res) => {
    try {
        let movie_id = req.params.id;

        //get the database connection
        pool.getConnection((error, connection) => {
            try {
                //make connection query
                let del_query = 'DELETE FROM movies WHERE id =?'
                connection.query(del_query, movie_id, (error, rows)=>{
                    try {
                        //release connection
                        connection.release();

                        res.status(201).json({message: `Movie of id: ${movie_id} has been removed sucessfully`})

                    } catch (error) {
                        res.status(401).json({error: 'syntax error/ bad request'})
                    }
                })

            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});
//export module
module.exports = router;
