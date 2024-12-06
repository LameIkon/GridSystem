const GRID_ELEMENT = document.getElementById('grid');
const PLAYER = document.getElementsByClassName('player');
const MAP_INDEX = 'map_index'; // The place where maps will be saved

let gridX; // columns. look into level-layout.js
let gridY; // rows. look into level-layout.js
let playerPosition; // LoadLevel controls this. look into level-layout.js
let turn = 0;
let maxTurn; // Load level controls this. look into level-layout.js
let noMoreTurns = false;
let modalOpenAndClose = true
let modalDelayInMiliseconds = 350; //equal to 1 second
let closeAlertPopupTimeInMilliseconds = 2500;

// #region Names for objects in the scene
// Error proofing the tiles
const TILES = {
    CELL: 'cell',
    PLAYER: 'player',
    WALL: 'wall',
    KEY: 'key',
    DOOR: 'door',
    GOAL: 'goal',
};
// #endregion

// #region Game Data
// Collection of the data to save for each map, this will most likely be expanded in the future
let gameData = {
    player: [],
    walls: [],
    keys: [],
    doors: [],
    goal: [],
};
// #endregion

// #region Grid
function initializeGrid(x, y) {
    gridX = x;
    gridY = y;

    // Setting the Grid variables dynamically in CSS
    document.documentElement.style.setProperty('--y', gridX);
    document.documentElement.style.setProperty('--x', gridY);
    createGrid();
}

function createGrid() {
    for (let row = 0; row < gridY; row++) {
        for (let col = 0; col < gridX; col++) {
            const CELL = document.createElement('div');
            CELL.classList.add(TILES.CELL);
            CELL.id = `${TILES.CELL}-${row * gridX + col}`; // Multiply the rows with the amount of columns then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
        }
    }
    renderPlayer();
}

// #endregion

function renderPlayer() {
    // Clear previous player positions
    document.querySelectorAll(`.${TILES.PLAYER}`).forEach(player => player.classList.remove(TILES.PLAYER));

    let index = playerPosition.y * gridX + playerPosition.x;
    let player_cell = document.getElementById(`${TILES.CELL}-${index}`);
    if (player_cell) {
        player_cell.classList.add(TILES.PLAYER);
    }
}

function renderTurnCounter() {
    document.getElementById('turn-counter').innerText = turn;
    document.getElementById('max-turn').innerText = maxTurn.toString();
}

function checkTurnLimit() {
    if (maxTurn <= turn) {
        noMoreTurns = true;
    }
}

function gameOver() {
    checkTurnLimit();
    if (noMoreTurns) {
        setTimeout(openLoseModal, modalDelayInMiliseconds);
    }
}

// #region Handle Movement
function handleMove(direction) {
    const stepsInput = document.getElementById(`${direction}-steps`);
    const steps = parseInt(stepsInput.value) || 1;  // Get the steps or default to 1
    move(direction, steps);  // Call move with the direction and custom steps
}

function move(direction, steps) {
    if (noMoreTurns) {
        return;
    }

    let newX = playerPosition.x;
    let newY = playerPosition.y;
    let step = 1;

    // This for loop makes sure that we only take one step at a time, to prevent 'jumping' over walls
    for (let i = 0; i < steps; i++) {
        switch (direction) {
            case 'left':
                // playerPosition.x = Math.max(0, playerPosition.x - steps);
                newX -= step;
                break;
            case 'right':
                // playerPosition.x = Math.min(gridX - 1, playerPosition.x + steps);
                newX += step;
                break;
            case 'up':
                // playerPosition.y = Math.max(0, playerPosition.y - steps);
                newY -= step;
                break;
            case 'down':
                // playerPosition.y = Math.min(gridY - 1, playerPosition.y + steps);
                newY += step;
                break;
            default:
                console.error('Unknown direction:', direction);
                return;
        }

        // Collision detection to not go out of bounds
        if (newX < 0 || newX >= gridX || newY < 0 || newY >= gridY) {
            callAlert("You can't move outside the grid. Please enter another value or choose another direction.", 8000)
            return;
        }

        // Collision detection for the obstacles
        if (!canWalk(newY * gridX + newX)) {
            callAlert("You are not a ghost, you can't move through walls. Please enter another value or choose another direction.", 8000)
            return;
        }

        if (pickedUpKey(newY * gridX + newX)) {
            isKeyObtained = true;
        }

        if (reachedGoal(newY * gridX + newX)) {
            console.log('Level Completed');
            setTimeout(openWinModal, modalDelayInMiliseconds);
        }
    }
    playerPosition.x = newX;
    playerPosition.y = newY;

    turn++;
    renderPlayer();
    renderTurnCounter();

    if (!reachedGoal(newY * gridX + newX)) {
        gameOver();
    }
}

function callAlert(message, timeout) {
    alert(message, timeout)
}

window.alert = function (message, timeout = null) {
    const alert = document.createElement('div')
    const alertButton = document.createElement('button')
    alert.classList.add('alert')
    alertButton.classList.add('alert-button')
    alertButton.innerText = 'Understood';
    alert.innerHTML = `<span style="margin: 5px">${message}</span>`;
    alert.appendChild(alertButton)
    alertButton.addEventListener(
        'click',
        function () { alert.remove() }
    )
    if (timeout != null) {
        setTimeout(
            function () { alert.remove() },
            Number(timeout)
        )
    }
    document.body.appendChild(alert)
}

function openLoseModal() {
    openModal("lose-modal");
}

function openWinModal() {
    openModal("win-modal");
}

function openModalAtStart() {
    if (!modalOpenAndClose) {
        return
    }
    openModal('info-modal')
    modalOpenAndClose = false
}

function openModal(modalName) {
    const modal = document.getElementById(modalName);
    modal.style.display = "block";
}

function closeModal() {
    const modals = [
        document.getElementById("info-modal")
    ];
    for (let i = 0; i < modals.length; i++) {
        modals[i].style.display = "none";
    }
}

// Check if the path is clear this will be extended in the future for other obstacles
function canWalk(pathID) {
    return !(isWall(pathID) || isDoor(pathID) && !isKeyObtained);
}

function pickedUpKey(pathID) {
    return isKey(pathID);
}

function reachedGoal(pathID) {
    return isGoal(pathID);
}

function isWall(id) {
    return hasTileClass(id, TILES.WALL)
}

function isDoor(id) {
    return hasTileClass(id, TILES.DOOR)
}

function isKey(id) {
    return hasTileClass(id, TILES.KEY)
}

function isGoal(id) {
    return hasTileClass(id, TILES.GOAL)
}

function hasTileClass(id, tileClass) {
    const cell = document.getElementById(`${TILES.CELL}-${id}`); // Find cell by id
    return cell ? cell.classList.contains(tileClass) : false; // Checks if cell id contains (placeholder) class.
}

// #endregion

// Keyboard controls
document.addEventListener('keydown', function (event) {
    const step = 1; // Define step size or determine based on key
    switch (event.key) {
        /*
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
         break
         */
        case 'Escape':
            closeModal()

    }
});

document.addEventListener('DOMContentLoaded', function () {
    let distance = 0;

    // Function to retrieve and store the distance from the input field
    function setDistance() {
        const distanceInput = document.getElementById("distance-input").value;

        // Check if the input is not empty and is a valid number
        if (distanceInput !== "" && !isNaN(distanceInput)) {
            distance = parseFloat(distanceInput);
            console.log("Distance set to:", distance);
        }
        else {
            console.log("Invalid number");
        }
    }

    // Event listener for the button to set distance
    document.getElementById("submit-distance").addEventListener("click", setDistance);
});

/*
 *  save() saves all the different tiles into the gameData object.
 *  Right now it is quite hard coded, some refactoring is needed.
 *  It also needs to be into a
 */

// #region Save/Load
function save(mapID) {
    if (!mapID) {
        console.error("Map name is required to save.");
        return;
    }

    // Update the gameData object with the current state
    gameData.player = [PLAYER.item(0).id.split('-')[1], playerPosition];
    saveTiles(TILES.WALL, gameData.walls);
    saveTiles(TILES.DOOR, gameData.doors);
    saveTiles(TILES.KEY, gameData.keys);
    saveTiles(TILES.GOAL, gameData.goal);
    const saveData = JSON.stringify(gameData);
    localStorage.setItem(`${MAP_INDEX}_${mapID}`, saveData);

    // Update the map index list
    let mapIndex = JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
    if (!mapIndex.includes(mapID)) {
        mapIndex.push(mapID);
        localStorage.setItem(MAP_INDEX, JSON.stringify(mapIndex));
    }
    console.log(`Map "${mapID}" saved.`);
}

/*
 *  saveTiles() is responsible for saving the different tiles.
 *  Right now it can only save into arrays.
 */

function saveTiles(tileName, savePlaceArray) {
    let tile = document.querySelectorAll(`.${tileName}`); // Getting all the tiles with the class {tileName},
    if (tile != null) {
        for (let i = 0; i < tile.length; i++) {
            savePlaceArray.push(tile[i].id.split('-')[1]);
        }
    }
}

// As save() does most of the heavy lifting, load() is much more simple
function load(mapID) {
    if (!mapID) {
        console.error("Map name is required to load.");
        return;
    }

    const loadData = localStorage.getItem(`${MAP_INDEX}_${mapID}`);
    if (!loadData) {
        console.error(`No saved data found for map: "${mapID}"`);
        return;
    }

    // Parse and load the game data
    gameData = JSON.parse(loadData);
    playerPosition = gameData.player[1];

    renderGame();
    renderPlayer();
    console.log(`Map "${mapID}" loaded.`);

}

function getSavedMaps() {
    return JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
}

function displaySavedMaps() {
    const savedMaps = getSavedMaps();
    savedMaps.forEach(mapName => {
        console.log(`Saved Map: ${mapName}`);
    });
}

function deleteMap(mapID) {
    if (!mapID) {
        console.error("Map name is required to delete.");
        return;
    }

    localStorage.removeItem(`${MAP_INDEX}_${mapID}`);
    let mapIndex = JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
    mapIndex = mapIndex.filter(name => name !== mapID);
    localStorage.setItem(MAP_INDEX, JSON.stringify(mapIndex));

    console.log(`Map "${mapName}" deleted.`);
}

// #endregion

function renderGame() {
    removeTile(TILES.PLAYER);
    removeTile(TILES.WALL);
    removeTile(TILES.KEY);
    removeTile(TILES.DOOR);
    removeTile(TILES.GOAL);

    addTile(TILES.WALL, gameData.walls);
    addTile(TILES.KEY, gameData.keys);
    addTile(TILES.DOOR, gameData.doors);
    addTile(TILES.GOAL, gameData.goal);
}

function removeTile(tileName) {
    document.querySelectorAll(`.${tileName}`).forEach(tile => tile.classList.remove(tileName)); // Takes all the tiles and removes the name from the class
}

// This needs an array to iterate over
function addTile(tileName, array) {
    for (let i = 0; i < array.length; i++) {
        let cell = document.getElementById(`${TILES.CELL}-${array[i]}`);
        if (cell) {
            cell.classList.add(tileName);
        }
    }
}

function resetAllSavedMaps() {
    localStorage.removeItem(MAP_INDEX);
    playerPosition = {x: 0, y: 0};
    keyPickup = false;
    gameData = {player: [], walls: [], keys: [], doors: [], goal: []};
    renderGame();
    renderPlayer();
    turn = 1;
    renderTurnCounter();
}

function levelSelecting(mapID) {
    document.getElementById('controls').style.display = 'block';
    load(mapID)
    deleteGrid()
    loadLevel(mapID);
    //initializeGrid(10, 5);
}

function deleteGrid() {
    GRID_ELEMENT.innerHTML = '';
}

function loadLevel(specifiedId) {
    fetch('../../json/level-layout.json') // Find the location of the json file
        //fetch('https://johanpedersen11.github.io/jsonData/level-layout.json') // Find the location of the json file
        .then(response => response.json()).then(info => {
        const FILTEREDITEM = info.find(element => element.levelId === specifiedId) // Find the json file with the specific id 'levelId'

        if (FILTEREDITEM) // Take the json and read/use the data
        {
            gridX = FILTEREDITEM.gridSize.x;
            gridY = FILTEREDITEM.gridSize.y;
            maxTurn = FILTEREDITEM.maxTurns;
            playerPosition = FILTEREDITEM.playerPosition;

            // Setting the Grid variables dynamically in CSS
            document.documentElement.style.setProperty('--y', gridX);
            document.documentElement.style.setProperty('--x', gridY);

            GRID_ELEMENT.insertAdjacentHTML('beforeend', FILTEREDITEM.layout); // Print title text as a 'h2'

            // Run scripts
            renderPlayer();
            renderTurnCounter();
        }
    });
}
    
    
    
