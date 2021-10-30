// app.js

// SETUP
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', exphbs({                     // Create an instance of the handlebars engine to process templates
    extname: ".hbs"
}));
var db = require('./database/db-connector')

// use public folder; set templating engine
app.use(express.static('public'));
app.set('view engine', '.hbs');

// handle JSON and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// use Heroku-defined port
const port = process.env.PORT || 3000;

// ROUTING
// define default route
app.get('/', (req, res) =>
    {  
        res.render('index');              
    }); 


app.get('/bsg', (req, res) =>
    {  
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.lname === undefined)
    {
        query1 = "SELECT * FROM bsg_people;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM bsg_planets;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let planets = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let planetmap = {}
            planets.map(planet => {
                let id = parseInt(planet.id, 10);

                planetmap[id] = planet["name"];
            })

            // Overwrite the homeworld ID with the name of the planet in the people object
            people = people.map(person => {
                return Object.assign(person, {homeworld: planetmap[person.homeworld]})
            })

            return res.render('bsg', {data: people, planets: planets});
        })
    })
});                                                      


app.post('/add-person-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let homeworld = parseInt(data.homeworld);
    if (isNaN(homeworld))
    {
        homeworld = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data.fname}', '${data.lname}', ${homeworld}, ${age})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM bsg_people;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// define EMPLOYEES entity GET route
app.get('/employees', (req, res) =>
{  
    let query1 = "SELECT * FROM Employees;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('employees', {data: rows});                  // Render the employees.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define EMPLOYEES entity ADD POST route
app.post('/add-employee-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let assigned_yard = parseInt(data.assigned_yard);
    if (isNaN(assigned_yard))
    {
        assigned_yard = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (first_name, last_name, phone_number, job_title, assigned_yard) VALUES ('${data.first_name}', '${data.last_name}', ${data.phone_number}, '${data.job_title}', ${assigned_yard})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Employees
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// define EMPLOYEES entity UPDATE GET route
app.get('/update_employee', (req, res) =>
{
    var context = {};
    let query1 = `SELECT * FROM Employees WHERE emp_id = ${req.query.input-PK};`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        res.render('update_employees', {data: rows});
    })
});

// define EMPLOYEES entity UPDATE POST route
app.post('/update-employee-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let assigned_yard = parseInt(data.assigned_yard);
    if (isNaN(assigned_yard))
    {
        assigned_yard = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `UPDATE Employees SET first_name = '${data.first_name}', last_name = '${data.last_name}', phone_number = ${data.phone_number}, job_title = '${data.job_title}', assigned_yard = ${assigned_yard} WHERE emp_id = ${emp_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
});


// define YARDS entity GET route
app.get('/yards', (req, res) =>
{
    let query1 = "SELECT * FROM Yards;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('yards', {data: rows});                  // Render the yards.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define YARDS entity POST route
app.post('/add-yard-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Yards (dog_limit) VALUES ('${data.dog_limit}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Yards
            query2 = `SELECT * FROM Yards;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// define YARDS entity UPDATE GET route
app.get('/update_yard', (req, res) =>
    {
        res.render('update_yard');
    });

// define KENNELS entity GET route
app.get('/kennels', (req, res) =>
{
    let query1 = "SELECT * FROM Kennels;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('kennels', {data: rows});                  // Render the kennels.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define KENNELS entity POST route
app.post('/add-kennel-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let current_tenant = parseInt(data.current_tenant);
    if (isNaN(current_tenant))
    {
        current_tenant = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Kennels (size_limit, current_tenant) VALUES (${data.size_limit}, ${data.current_tenant})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Kennels
            query2 = `SELECT * FROM Kennels;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// define KENNELS entity UPDATE GET route
app.get('/update_kennel', (req, res) =>
    {
        res.render('update_kennel');
    });

// define DOGS entity GET route
app.get('/dogs', (req, res) =>
{
    let query1 = "SELECT * FROM Dogs;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('dogs', {data: rows});                  // Render the dogs.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define DOGS entity POST route
app.post('/add-dog-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Dogs (dog_name, dog_size, assigned_yard, assigned_kennel) VALUES ('${data.dog_name}', ${data.dog_size}, ${data.assigned_yard}, ${data.assigned_kennel})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Dogs
            query2 = `SELECT * FROM Dogs;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// define DOGS entity UPDATE GET route
app.get('/update_dog', (req, res) =>
    {
        res.render('update_dog');
    });

// define DOG_EMPLOYEES_RELATIONS entity GET route
app.get('/dog_employee_relations', (req, res) =>
{
    let query1 = "SELECT * FROM Dog_Employee_Relations;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('dog_employee_relations', {data: rows});                  // Render the dog_employee_relations.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define DOG_EMPLOYEE_RELATIONS entity POST route
app.post('/add-dog_employee_relation-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Dog_Employee_Relations (dog_id, emp_id, get_along) VALUES (${data.dog_id}, ${data.emp_id}, ${data.get_along})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Dog_Employee_Relations
            query2 = `SELECT * FROM Dog_Employee_Relations;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// define DOG_EMPLOYEE_RELATIONS entity UPDATE GET route
app.get('/update_dog_employee_relation', (req, res) =>
    {
        res.render('update_dog_employee_relation');
    });

 // LISTENER
 app.listen(port, () => console.log(`App listening at http://localhost:${port}; ctrl + C to stop.`));
