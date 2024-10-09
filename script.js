document.addEventListener('DOMContentLoaded', () => { 
    const gridElement = document.getElementById('grid');
var grid_x; // columns
var grid_y; // rows
let playerPosition = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;

const walls = [
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
            if (isWall(col, row)) {
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
    

function isWall(col, row){
    return walls.some(wall => wall.x === col && wall.y === row);
}


// Render the player on the grid
function render_player() {
   // Remove previous player position
   document.querySelectorAll('.player').forEach(player => player.classList.remove('player'));

   // Add player to the new position
   const selector = `.cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`;
   const playerCell = document.querySelector(selector);
   if (playerCell && !playerCell.classList.contains('wall')) { // Ensure player isn't on a wall
       playerCell.classList.add('player');
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
    const moveAmountInput = document.getElementById('moveAmount');
    let moveAmount = parseInt(moveAmountInput.value);
    if (isNaN(moveAmount) || moveAmount < 1) {
        alert('Please enter a valid number of steps (minimum 1).');
        return;
    }

    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch(direction) {
        case 'left':
            newX -= moveAmount;
            break;
        case 'right':
            newX += moveAmount;
            break;
        case 'up':
            newY -= moveAmount;
            break;
        case 'down':
            newY += moveAmount;
            break;
        default:
            console.error('Unknown direction:', direction);
            return;
    }

    // Check boundaries
    if (newX < 0 || newX >= grid_x || newY < 0 || newY >= grid_y) {
        alert('Move out of bounds!');
        return;
    }

    // Check for walls in the path
    const pathClear = checkPath(playerPosition.x, playerPosition.y, newX, newY, direction);
    if (!pathClear) {
        alert('Cannot move through walls!');
        return;
    }

    // Update player position
    playerPosition.x = newX;
    playerPosition.y = newY;

    // Render changes
    render_player();
    turn++;
    render_turn();
}

 // Check if the path is clear (no walls between current and new position)
 function checkPath(currentX, currentY, targetX, targetY, direction) {
    const step = 1; // Move one step at a time to check each cell
    if (direction === 'left' || direction === 'right') {
        const stepX = direction === 'left' ? -1 : 1;
        for (let x = currentX + stepX; x !== targetX + stepX; x += stepX) {
            if (isWall(x, currentY)) {
                return false;
            }
        }
    } else if (direction === 'up' || direction === 'down') {
        const stepY = direction === 'up' ? -1 : 1;
        for (let y = currentY + stepY; y !== targetY + stepY; y += stepY) {
            if (isWall(currentX, y)) {
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
