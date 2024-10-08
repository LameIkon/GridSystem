const GRID_ELEMENT = document.getElementById('grid');
let grid_x = 20; // columns
let grid_y = 12; // rows
let playerPosition = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;


function init_grid()
{


}


// creating the grid
function create_grid() {

    // Setting the Grid variables dynamicliy in the CSS
    document.documentElement.style.setProperty('--y',grid_x); 
    document.documentElement.style.setProperty('--x',grid_y);

    for (let row = 0; row < grid_y; row++) {
        for(let col = 0; col < grid_x; col++){
            const CELL = document.createElement('div');
            CELL.classList.add('cell');
            CELL.id = `cell-${row * grid_x + col}`; // Multiply the rows with the amount of colums then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
        }
    }
    render_player();
}

// Render the player on the grid
function render_player() {
    // Clear previous player positions
    document.querySelectorAll('.player').forEach(player => player.classList.remove('player'));

    const INDEX = playerPosition.y * grid_x + playerPosition.x;
    const PLAYER_CELL = document.getElementById(`cell-${INDEX}`);
    if (PLAYER_CELL) {
        PLAYER_CELL.classList.add('player');
    }
}

// Render the turn counter
function render_turn() {
    document.getElementById('turn-counter').innerText = turn;
}

// Handle movement
function move(direction, steps) {
    switch(direction) {
        case 'left':
            playerPosition.x = Math.max(0, playerPosition.x - steps);
            break;
        case 'right':
            playerPosition.x = Math.min(grid_x - 1, playerPosition.x + steps);
            break;
        case 'up':
            playerPosition.y = Math.max(0, playerPosition.y - steps);
            break;
        case 'down':
            playerPosition.y = Math.min(grid_y - 1, playerPosition.y + steps);
            break;
    }
    render_player();
    turn++;
    render_turn();
}

// Keyboard controls
document.addEventListener('keydown', function(event) {
    const step = 1; // Define step size or determine based on key
    switch(event.key) {
        case 'ArrowLeft':
            move('left', step);
            break;
        case 'ArrowRight':
            move('right', step);
            break;
        case 'ArrowUp':
            move('up', step);
            break;
        case 'ArrowDown':
            move('down', step);
            break;
    }
});

// Initialize the game
create_grid();
render_turn();
