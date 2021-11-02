// ./public/js/update_employee.js

// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('update-employee-form-ajax');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmpID = document.getElementById("input-emp_id");
    let inputFirstName = document.getElementById("input-first_name");
    let inputLastName = document.getElementById("input-last_name");
    let inputPhoneNumber = document.getElementById("input-phone_number");
    let inputJobTitle = document.getElementById("input-job_title");
    let inputAssignedYard = document.getElementById("input-assigned_yard");

    // Get the values from the form fields
    let empIDValue = inputEmpID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let jobTitleValue = inputJobTitle.value;
    let AssignedYardValue = inputAssignedYard.value;

    // Put our data we want to send in a javascript object
    let data = {
        emp_id: empIDValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        phone_number: phoneNumberValue,
        job_title: jobTitleValue,
        assigned_yard: AssignedYardValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputEmpID.value = '';
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPhoneNumber.value = '';
            inputJobTitle.value = '';
            inputAssignedYard.value = '';

            window.location.href = "/employees";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})