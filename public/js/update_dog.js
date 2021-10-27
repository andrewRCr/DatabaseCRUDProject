// ./public/js/update_dog.js

// Get the objects we need to modify
let updateDogForm = document.getElementById('add-dog-form-ajax');

// Modify the objects we need
updateDogForm.addEventListener("submit", function (e) {
    
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
    xhttp.open("POST", "/update-dog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

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

