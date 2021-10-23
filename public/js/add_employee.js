// ./public/js/add_employee.js

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-first_name");
    let inputLastName = document.getElementById("input-last_name");
    let inputPhoneNumber = document.getElementById("input-phone_number");
    let inputJobTitle = document.getElementById("input-job_title");
    let inputAssignedYard = document.getElementById("input-assigned_yard");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let jobTitleValue = inputJobTitle.value;
    let AssignedYardValue = inputAssignedYard.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: firstNameValue,
        last_name: lastNameValue,
        phone_number: phoneNumberValue,
        job_title: jobTitleValue,
        assigned_yard: AssignedYardValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPhoneNumber.value = '';
            inputJobTitle.value = '';
            inputAssignedYard.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Employees
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("employee-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let emp_idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let jobTitleCell = document.createElement("TD");
    let assignedYardCell = document.createElement("TD");

    // Fill the cells with correct data
    emp_idCell.innerText = newRow.emp_id;
    firstNameCell.innerText = newRow.first_name;
    lastNameCell.innerText = newRow.last_name;
    phoneNumberCell.innerText = newRow.phone_number;
    jobTitleCell.innerText = newRow.job_title;
    assignedYardCell.innerText = newRow.assigned_yard;

    // Add the cells to the row 
    row.appendChild(emp_idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(jobTitleCell);
    row.appendChild(assignedYardCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}