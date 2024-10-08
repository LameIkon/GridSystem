const gridElement = document.getElementById('grid');
const gridSize = 10; // 10x10 grid
let playerPosition = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;

// Initialize the grid
function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${i}`;
        gridElement.appendChild(cell);
    }
    renderPlayer();
}

// Render the player on the grid
function renderPlayer() {
    // Clear previous player positions
    document.querySelectorAll('.player').forEach(player => player.classList.remove('player'));

    const index = playerPosition.y * gridSize + playerPosition.x;
    const playerCell = document.getElementById(`cell-${index}`);
    if (playerCell) {
        playerCell.classList.add('player');
    }
}

// Render the turn counter
function renderTurn() {
    document.getElementById('turn-counter').innerText = turn;
}

// Handle movement
function move(direction, steps) {
    switch(direction) {
        case 'left':
            playerPosition.x = Math.max(0, playerPosition.x - steps);
            break;
        case 'right':
            playerPosition.x = Math.min(gridSize - 1, playerPosition.x + steps);
            break;
        case 'up':
            playerPosition.y = Math.max(0, playerPosition.y - steps);
            break;
        case 'down':
            playerPosition.y = Math.min(gridSize - 1, playerPosition.y + steps);
            break;
    }
    renderPlayer();
    turn++;
    renderTurn();
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
createGrid();
renderTurn();
