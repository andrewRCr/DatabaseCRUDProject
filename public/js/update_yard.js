// ./public/js/update_yard.js

// Get the objects we need to modify
let updateYardForm = document.getElementById('update-yard-form-ajax');

// Modify the objects we need
updateYardForm.addEventListener("submit", function (e) {
    
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
    xhttp.open("POST", "/update-yard-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

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
