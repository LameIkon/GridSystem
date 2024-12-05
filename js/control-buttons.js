function buttonMove() {
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", buttonMovement);
    }
}

function buttonMovement(event) {
    let dir = event.srcElement.id.split('-')[1]; // Take the id of the button element splitting it at take the second elemet, which is either 'left', 'right', 'up' or 'down'
    var steps = event.srcElement.parentNode.childNodes[1].childNodes[0].value; // Get the source elements parent then the span child object then the child input and the value of it. Quite hard coded but it works.
    if (!steps){
        alert('Please enter a number in the parameter.');
        return;
    }
    move(dir, steps);
}

setTimeout(buttonsLoad, 100);

function buttonsLoad() {
    renderTurnCounter();
    buttonMove();
}
