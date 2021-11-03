// ./public/js/update_dog_employee_relation.js

// Get the objects we need to modify
let updateDogEmployeeRelationForm = document.getElementById('update-dog_employee_relation-form-ajax');

// Modify the objects we need
updateDogEmployeeRelationForm.addEventListener("submit", function (e) {
    
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
    xhttp.open("POST", "/update-dog-employee-relation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function()
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputDogid.value = '';
            inputEmpid.value = '';
            inputGetAlong.value = '';

            window.location.href = "/dog_employee_relations";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})