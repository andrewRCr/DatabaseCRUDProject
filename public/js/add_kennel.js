// ./public/js/add_kennel.js

// Get the objects we need to modify
let addKennelForm = document.getElementById('add-kennel-form-ajax');

// Modify the objects we need
addKennelForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSizeLimit = document.getElementById("input-size_limit");
    let inputCurrentTenant = document.getElementById("input-current_tenant");

    // Get the values from the form fields
    let sizeLimitValue = inputSizeLimit.value;
    let currentTenantValue = inputCurrentTenant.value;

    // Put our data we want to send in a javascript object
    let data = {
        size_limit: sizeLimitValue,
        current_tenant: currentTenantValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-kennel-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSizeLimit.value = '';
            inputCurrentTenant.value = '';

            window.location.href = "/kennels";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Kennels
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("kennels-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let kennel_idCell = document.createElement("TD");
    let sizeLimitCell = document.createElement("TD");
    let currentTenantCell = document.createElement("TD");

    // Fill the cells with correct data
    kennel_idCell.innerText = newRow.kennel_id;
    sizeLimitCell.innerText = newRow.size_limit;
    currentTenantCell.innerText = newRow.current_tenant;

    // Add the cells to the row 
    row.appendChild(kennel_idCell);
    row.appendChild(sizeLimitCell);
    row.appendChild(currentTenantCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
