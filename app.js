// app.js

// SETUP AND ROUTING
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', exphbs({                     // Create an instance of the handlebars engine to process templates
    extname: ".hbs"
}));
app.use(express.static('public'));
app.set('view engine', '.hbs');
var db = require('./database/db-connector')
// use Heroku-defined port
const port = process.env.PORT || 3000;



// define default route
app.get('/', (req, res) =>
    {  
        let query1 = "SELECT * FROM bsg_people;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query




 // LISTENER
 app.listen(port, () => console.log(`App listening at http://localhost:${port}; ctrl + C to stop.`));

