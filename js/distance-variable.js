let distance;
let levelId;
const DOM_LOAD_TIME_DELAY = 1000

function setDistance(value) {
    distance = value;
    console.log("Distance updated to:", distance);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const submitButton = document.getElementById("submit-distance");
        const inputsubmit = document.getElementById("distance-input")

        if (submitButton) {
            submitButton.addEventListener("click", updateDistance);
        }
        else {
            console.error("Submit button not found");
        }

        if (inputsubmit) {
            inputsubmit.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    updateDistance();
                }
            });
        }
        else {
            console.error("input-Submit not found");
        }
    }, DOM_LOAD_TIME_DELAY);
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
    let steps = distance;
    if (distance === undefined || distance === null) {
        alert('Please set a value to "Steps"', 5000)
        return;
    }
    console.log(`False, distance = ${distance}`)
    move(dir, steps);
}

setTimeout(buttonsLoad, 50);

function buttonsLoad() {
    renderTurnCounter();
    buttonMove();
}

function updateVariableValue(value) {
    document.getElementById('hey').innerText = 'Steps is set to: ';
    document.getElementById("variable-value").innerText = value;
}
