// Declare the global variable on the `window` object
let distance = 0; // Initial value
let levelId;

// Function to set the distance
function setDistance(value) {
    distance = value;
    console.log("Distance updated to:", distance);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set a timeout to ensure the DOM is fully loaded before running the code
    setTimeout(function () {
        // Attempt to find the submit button
        const submitButton = document.getElementById("submit-distance");

        if (submitButton) {
            // Add the event listener to the button
            submitButton.addEventListener("click", updateDistance);
        }
        else {
            console.error("Submit button not found");
        }
    }, 1000); // Delay of 1 second to ensure the DOM has fully loaded
});

// Function to update the distance based on input
function updateDistance() {
    console.log("updateDistance is called");
    const distanceInput = document.getElementById("distance-input").value;

    if (distanceInput !== "" && !isNaN(distanceInput)) {
        setDistance(parseFloat(distanceInput));
        console.log("Distance set to:", distance);
        updateVariableValue(distanceInput)
    }
    else {
        console.log("Invalid number");
    }
}

function buttonMove() {
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", buttonMovement);
    }
}

function buttonMovement(event) {
    let dir = event.srcElement.id.split('-')[1]; // Take the id of the button element splitting it at take the second elemet, which is either 'left', 'right', 'up' or 'down'
    let steps = 2 + distance;
    move(dir, steps);
}

setTimeout(buttonsLoad, 100);

function buttonsLoad() {
    renderTurnCounter();
    buttonMove();
}

function updateVariableValue(value) {
    document.getElementById("variable-value").innerText = value
}

function oogaBooga() {
    const functionFields = document.querySelectorAll(".function-var-field");
    for (var i = 0; i < functionFields.length; i++) {
        functionFields[i].innerText = "Steps + 2";
    }
    console.log("this WORKSKSSA");
}

setTimeout(oogaBooga, 100);
