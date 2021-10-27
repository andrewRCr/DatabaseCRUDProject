// ./public/js/update_kennel.js

// Get the objects we need to modify
let updateKennelForm = document.getElementById('update-kennel-form-ajax');

// Modify the objects we need
updateKennelForm.addEventListener("submit", function (e) {
    
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
    xhttp.open("POST", "/update-kennel-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputSizeLimit.value = '';
            inputCurrentTenant.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})