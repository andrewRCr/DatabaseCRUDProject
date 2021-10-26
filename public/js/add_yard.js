// ./public/js/add_yard.js

// Get the objects we need to modify
let addYardForm = document.getElementById('add-yard-form-ajax');

// Modify the objects we need
addYardForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogLimit = document.getElementById("input-dog_limit");

    // Get the values from the form fields
    let dogLimitValue = inputDogLimit.value;

    // Put our data we want to send in a javascript object
    let data = {
        dog_limit: dogLimitValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-yard-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDogLimit.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Yards
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("yard-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let yard_idCell = document.createElement("TD");
    let dogLimitCell = document.createElement("TD");

    // Fill the cells with correct data
    yard_idCell.innerText = newRow.yard_id;
    dogLimitCell.innerText = newRow.dog_limit;

    // Add the cells to the row 
    row.appendChild(yard_idCell);
    row.appendChild(dogLimitCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
