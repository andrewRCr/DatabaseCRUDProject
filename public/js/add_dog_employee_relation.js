// ./public/js/add_dog_employee_relation.js

// Get the objects we need to modify
let addDogEmployeeRelationForm = document.getElementById('add-dog_employee_relation-form-ajax');

// Modify the objects we need
addDogEmployeeRelationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogid = document.getElementById("input-dog_id");
    let inputEmpid = document.getElementById("input-emp_id");
    let inputGetAlong = document.getElementById("input-get_along");

    // Get the values from the form fields
    let dogidValue = inputDogid.value;
    let empidValue = inputEmpid.value;
    let getAlongValue = inputGetAlong.value;

    // Put our data we want to send in a javascript object
    let data = {
        dog_id: dogidValue,
        emp_id: empidValue,
        get_along: getAlongValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dog_employee_relation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDogid.value = '';
            inputEmpid.value = '';
            inputGetAlong.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Dog_Employee_Relations
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dog_employee_relations-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let dogidCell = document.createElement("TD");
    let empidCell = document.createElement("TD");
    let getAlongCell = document.createElement("TD");

    // Fill the cells with correct data
    dogidCell.innerText = newRow.dog_id;
    empidCell.innerText = newRow.emp_id;
    getAlongCell.innerText = newRow.get_along;

    // Add the cells to the row 
    row.appendChild(dogidCell);
    row.appendChild(empidCell);
    row.appendChild(getAlongCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
