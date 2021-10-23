// ./database/db-connector.js

// get an instance of mysql we can use in the app
var mysql = require("mysql");

// create a connection using credentials
var pool = mysql.createPool({
    host: "x8autxobia7sgh74.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "nt3gj8186ds60d3d",
    password: "co67xuxa7wukbkv3",
    database: "wae9tszq9ltb6lbu"
  });

// export it for use in our applicaiton
module.exports.pool = pool;


// DATABASE CLI LOGIN:
// mysql --host=x8autxobia7sgh74.cbetxkdyhwsb.us-east-1.rds.amazonaws.com --user=nt3gj8186ds60d3d --password=co67xuxa7wukbkv3 --reconnect wae9tszq9ltb6lbu