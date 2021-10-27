// ./public/js/add_dog.js

// Get the objects we need to modify
let addDogForm = document.getElementById('add-dog-form-ajax');

// Modify the objects we need
addDogForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogName = document.getElementById("input-dog_name");
    let inputDogSize = document.getElementById("input-size");
    let inputAssignedYard = document.getElementById("input-assigned_yard");
    let inputAssignedKennel = document.getElementById("input-assigned_kennel");

    // Get the values from the form fields
    let dogNameValue = inputDogName.value;
    let dogSizeValue = inputDogSize.value;
    let assignedYardValue = inputAssignedYard.value;
    let assignedKennelValue = inputAssignedKennel.value;

    // Put our data we want to send in a javascript object
    let data = {
        dog_name: dogNameValue,
        dog_size: dogSizeValue,
        assigned_yard: assignedYardValue,
        assigned_kennel: assignedKennelValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDogName.value = '';
            inputDogSize.value = '';
            inputAssignedYard.value = '';
            inputAssignedKennel.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Dogs
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dog-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let dog_idCell = document.createElement("TD");
    let dogNameCell = document.createElement("TD");
    let sizeCell = document.createElement("TD");
    let assignedYardCell = document.createElement("TD");
    let assignedKennelCell = document.createElement("TD");

    // Fill the cells with correct data
    dog_idCell.innerText = newRow.dog_id;
    dogNameCell.innerText = newRow.dog_name;
    sizeCell.innerText = newRow.size;
    assignedYardCell.innerText = newRow.assigned_yard;
    assignedKennelCell.innerText = newRow.assigned_kennel;

    // Add the cells to the row 
    row.appendChild(dog_idCell);
    row.appendChild(dogNameCell);
    row.appendChild(sizeCell);
    row.appendChild(assignedYardCell);
    row.appendChild(assignedKennelCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
