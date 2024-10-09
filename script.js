document.addEventListener('DOMContentLoaded', () => { 
    const gridElement = document.getElementById('grid');
var grid_x; // columns
var grid_y; // rows
let playerPosition = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;

const WALLS = [
    {x: 3, y: 0},
    {x: 3, y: 1},
    {x: 3, y: 2},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3}
];



function init_grid(x, y)
{
    grid_x = x;
    grid_y = y;
        // Setting the Grid variables dynamicliy in the CSS
        document.documentElement.style.setProperty('--x',grid_x); 
        document.documentElement.style.setProperty('--y',grid_y);
        create_grid();
}


// creating the grid
function create_grid() {

    gridElement.innerHTML = '';

    for (let row = 0; row < grid_y; row++) {
        for(let col = 0; col < grid_x; col++){
            const CELL = document.createElement('div');
            CELL.classList.add('cell');
            CELL.dataset.x = col;
            CELL.dataset.y = row;

            // Check if the cell is a wall
            if (is_wall(col, row)) {
                CELL.classList.add('wall');
            }

            // Check if the cell is the player's position
            if (col === playerPosition.x && row === playerPosition.y) {
                CELL.classList.add('player');
            }

            gridElement.appendChild(CELL);
        }

    }
    render_player();
}
    

function is_wall(col, row){
    return WALLS.some(wall => wall.x === col && wall.y === row);
}


// Render the player on the grid
function render_player() {
   // Remove previous player position
   document.querySelectorAll('.player').forEach(player => player.classList.remove('player'));

   // Add player to the new position
   const SELECTOR = `.cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`;
   const PLAYERCELL = document.querySelector(SELECTOR);
   if (PLAYERCELL && !PLAYERCELL.classList.contains('wall')) { // Ensure player isn't on a wall
       PLAYERCELL.classList.add('player');
    } 
   else {
       console.error('Player is trying to occupy a wall cell!');
    }
}

// Render the turn counter
function render_turn() {
    document.getElementById('turn-counter').innerText = turn;
}


 // Handle movement
 window.move = function(direction) { // Make the function globally accessible
    const MOVE_AMOUNT_INPUT = document.getElementById('moveAmount');
    let move_amount = parseInt(MOVE_AMOUNT_INPUT.value);
    if (isNaN(move_amount) || move_amount < 1) {
        alert('Please enter a valid number of steps (minimum 1).');
        return;
    }

    let new_x = playerPosition.x;
    let new_y = playerPosition.y;

    switch(direction) {
        case 'left':
            new_x -= move_amount;
            break;
        case 'right':
            new_x += move_amount;
            break;
        case 'up':
            new_y -= move_amount;
            break;
        case 'down':
            new_y += move_amount;
            break;
        default:
            console.error('Unknown direction:', direction);
            return;
    }

    // Check boundaries
    if (new_x < 0 || new_x >= grid_x || new_y < 0 || new_y >= grid_y) {
        alert('Move out of bounds!');
        return;
    }

    // Check for walls in the path
    const PATH_CLEAR = check_path(playerPosition.x, playerPosition.y, new_x, new_y, direction);
    if (!PATH_CLEAR) {
        alert('Cannot move through walls!');
        return;
    }

    // Update player position
    playerPosition.x = new_x;
    playerPosition.y = new_y;

    // Render changes
    render_player();
    turn++;
    render_turn();
}

 // Check if the path is clear (no walls between current and new position)
 function check_path(current_x, current_y, target_x, target_y, direction) {
    const step = 1; // Move one step at a time to check each cell
    if (direction === 'left' || direction === 'right') {
        const STEP_X = direction === 'left' ? -1 : 1;
        for (let x = current_x + STEP_X; x !== target_x + STEP_X; x += STEP_X) {
            if (is_wall(x, current_y)) {
                return false;
            }
        }
    } else if (direction === 'up' || direction === 'down') {
        const STEP_Y = direction === 'up' ? -1 : 1;
        for (let y = current_y + STEP_Y; y !== target_y + STEP_Y; y += STEP_Y) {
            if (is_wall(current_x, y)) {
                return false;
            }
        }
    }
    return true;
}

 // Keyboard controls
 document.addEventListener('keydown', function(event) {
    const directionMap = {
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
    };
    const direction = directionMap[event.key];
    if (direction) {
        move(direction);
    }
});


// Initialize the game
init_grid(10, 10);
render_turn();

});
