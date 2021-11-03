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

    if (req.query.emp_id != undefined)
    {
        let query2 = `DELETE FROM Employees WHERE emp_id=${req.query.emp_id}`
        db.pool.query(query2, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        })
    }

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
        let query1 = `SELECT * FROM Employees WHERE emp_id=${req.query.emp_id}`
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.render('update_employee', {
                    emp_info:{
                        emp_id:rows[0].emp_id,
                        first_name:rows[0].first_name,
                        last_name:rows[0].last_name,
                        phone_number:rows[0].phone_number,
                        job_title:rows[0].job_title,
                        assigned_yard:rows[0].assigned_yard
                    }
                });
            }
        });
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
    let phone_number = parseInt(data.phone_number);
    if (isNaN(phone_number))
    {
        phone_number = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `UPDATE Employees SET first_name = '${data.first_name}', last_name = '${data.last_name}', phone_number = ${phone_number}, job_title = '${data.job_title}', assigned_yard = ${assigned_yard} WHERE emp_id = ${data.emp_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
    res.sendStatus(200);
});


// define YARDS entity GET route
app.get('/yards', (req, res) =>
{  
    let query1 = "SELECT * FROM Yards;";               // Define our query

    if (req.query.yard_id != undefined)
    {
        let query2 = `DELETE FROM Yards WHERE yard_id=${req.query.yard_id}`
        db.pool.query(query2, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        })
    }

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
        let query1 = `SELECT * FROM Yards WHERE yard_id=${req.query.yard_id}`
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.render('update_yard', {
                    yard_info:{
                        yard_id:rows[0].yard_id,
                        dog_limit:rows[0].dog_limit
                    }
                });
            }
        });
    });

// define YARDS entity UPDATE POST route
app.post('/update-yard-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let dog_limit = parseInt(data.dog_limit);
    if (isNaN(dog_limit))
    {
        dog_limit = 'NULL';
    }

    // Create the query and run it on the database
    query1 = `UPDATE Yards SET dog_limit = ${dog_limit} WHERE yard_id = ${data.yard_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
    res.sendStatus(200);
});

// define KENNELS entity GET route
app.get('/kennels', (req, res) =>
{  
    let query1 = "SELECT * FROM Kennels;";               // Define our query

    if (req.query.kennel_id != undefined)
    {
        let query2 = `DELETE FROM Kennels WHERE kennel_id=${req.query.kennel_id}`
        db.pool.query(query2, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        })
    }

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('kennels', {data: rows});                  // Render the kennels.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// define KENNELS entity UPDATE GET route
app.get('/update_kennel', (req, res) =>
    {
        let query1 = `SELECT * FROM Kennels WHERE kennel_id=${req.query.kennel_id}`
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.render('update_kennel', {
                    kennel_info:{
                        kennel_id:rows[0].kennel_id,
                        size_limit:rows[0].size_limit,
                        current_tenant:rows[0].current_tenant
                    }
                });
            }
        });
    });

// define KENNELS entity UPDATE POST route
app.post('/update-kennel-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let size_limit = parseInt(data.size_limit);
    if (isNaN(size_limit))
    {
        size_limit = 'NULL';
    }
    let current_tenant = parseInt(data.current_tenant);
    if (isNaN(current_tenant))
    {
        current_tenant = 'NULL';
    }

    // Create the query and run it on the database
    query1 = `UPDATE Kennels SET size_limit = ${size_limit}, current_tenant = ${current_tenant} WHERE kennel_id = ${data.kennel_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
    res.sendStatus(200);
});

// define DOGS entity GET route
app.get('/dogs', (req, res) =>
{  
    let query1 = "SELECT * FROM Dogs;";               // Define our query

    if (req.query.dog_id != undefined)
    {
        let query2 = `DELETE FROM Dogs WHERE dog_id=${req.query.dog_id}`
        db.pool.query(query2, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        })
    }

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
        let query1 = `SELECT * FROM Dogs WHERE dog_id=${req.query.dog_id}`
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.render('update_dog', {
                    dog_info:{
                        dog_id:rows[0].dog_id,
                        dog_name:rows[0].dog_name,
                        dog_size:rows[0].dog_size,
                        assigned_yard:rows[0].assigned_yard,
                        assigned_kennel:rows[0].assigned_kennel
                    }
                });
            }
        });
    });

// define DOGS entity UPDATE POST route
app.post('/update-dog-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let dog_size = parseInt(data.dog_size);
    if (isNaN(dog_size))
    {
        dog_size = 'NULL';
    }
    let assigned_yard = parseInt(data.assigned_yard);
    if (isNaN(assigned_yard))
    {
        assigned_yard = 'NULL';
    }
    let assigned_kennel = parseInt(data.assigned_kennel);
    if (isNaN(assigned_kennel))
    {
       assigned_kennel = 'NULL';
    }

    // Create the query and run it on the database
    query1 = `UPDATE Dogs SET dog_name = '${data.dog_name}', dog_size = ${dog_size}, assigned_yard = ${assigned_yard}, assigned_kennel = ${assigned_kennel} WHERE dog_id = ${data.dog_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
    res.sendStatus(200);
});

// define DOG_EMPLOYEES_RELATIONS entity GET route
app.get('/dog_employee_relations', (req, res) =>
{  
    let query1 = "SELECT * FROM Dog_Employee_Relations;";               // Define our query

    if (req.query.emp_id != undefined)
    {
        let query2 = `DELETE FROM Dog_Employee_Relations WHERE dog_id=${req.query.dog_id} AND emp_id=${req.query.emp_id}`
        db.pool.query(query2, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
        })
    }

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
app.get('/update-dog_employee_relation', (req, res) =>
    {
        let query1 = `SELECT * FROM Dog_Employee_Relations WHERE emp_id=${req.query.emp_id} AND dog_id=${req.query.dog_id}`
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.render('update_dog_employee_relation', {
                    dog_emp_info:{
                        dog_id:rows[0].dog_id,
                        emp_id:rows[0].emp_id,
                        get_along:rows[0].get_along
                    }
                });
            }
        });
    });

// define YARDS entity UPDATE POST route
app.post('/update-dog-employee-relation-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let get_along = parseInt(data.get_along);
    if (isNaN(get_along))
    {
        get_along = NULL;
    }

    // Create the query and run it on the database
    query1 = `UPDATE Dog_Employee_Relations SET get_along = ${get_along} WHERE dog_id = ${data.dog_id} AND emp_id = ${data.emp_id}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    })
    res.sendStatus(200);
});

 // LISTENER
 app.listen(port, () => console.log(`App listening at http://localhost:${port}; ctrl + C to stop.`));