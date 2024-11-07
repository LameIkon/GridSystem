const GRID_ELEMENT = document.getElementById('grid');
const PLAYER = document.getElementsByClassName('player');
const MAP_INDEX = 'map_index'; // the place where it will save maps.
let keyPickup = false;

let gridX; // columns
let gridY; // rows
let playerPosition = {x: 0, y: 0}; // Starting at top-left corner
let turn = 1;

let maxTurn = 10;
let noMoreTurns = false;

// #region Names for objects in the scene
// Error proofing the tiles
const TILES =
{
    CELL: 'cell',
    PLAYER: 'player',
    WALL: 'wall',
    DOOR: 'door',
    GOAL: 'goal',
    KEY: 'key'
};
// #endregion


// #region Game Data
// Collection of the data to save for each map, this will most likely be expanded in the future
let gameData =
{
    player: [],
    walls: [],
    keys: [],
    doors: [],
    goal: [],
};
// #endregion

// #region Grid
function initializeGrid(x, y)
{
    gridX = x;
    gridY = y;

    // Setting the Grid variables dynamically in CSS
    document.documentElement.style.setProperty('--y', gridX);
    document.documentElement.style.setProperty('--x', gridY);
    createGrid();
}

function createGrid()
{
    for (let row = 0; row < gridY; row++)
    {
        for (let col = 0; col < gridX; col++)
        {
            const CELL = document.createElement('div');
            CELL.classList.add(TILES.CELL);
            CELL.id = `${TILES.CELL}-${row * gridX + col}`; // Multiply the rows with the amount of columns then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
        }
    }
    renderPlayer();
}
// #endregion

// Render the player on the grid
function renderPlayer()
{
    // Clear previous player positions
    document.querySelectorAll(`.${TILES.PLAYER}`).forEach(player => player.classList.remove(TILES.PLAYER));

    let index = playerPosition.y * gridX + playerPosition.x;
    let player_cell = document.getElementById(`${TILES.CELL}-${index}`);
    if (player_cell)
    {
        player_cell.classList.add(TILES.PLAYER);
    }
}

function renderTurnCounter()
{
    document.getElementById('turn-counter').innerText = turn;
}

function checkTurnLimit(){
    if(maxTurn <= turn){
        noMoreTurns = true;
    }
}

function checkGameOver(){
    checkTurnLimit();
    if(noMoreTurns){
        console.log('Game over'); //make acutal endgame message or something.
    }
}


// #region Handle Movement
function handleMove(direction)
{
    const stepsInput = document.getElementById(`${direction}-steps`);
    const steps = parseInt(stepsInput.value) || 1;  // Get the steps or default to 1
    move(direction, steps);  // Call move with the direction and custom steps
}

function move(direction, steps)
{
    if(!noMoreTurns){
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    let step = 1;

    // This for loop makes sure that we only take one step at a time, to prevent 'jumping' over walls
    for (let i = 0; i < steps; i++)
    {
        switch (direction)
        {
            case 'left':
                // playerPosition.x = Math.max(0, playerPosition.x - steps); // This just looks nice!! maybe it can be used again for floats
                newX -= step;
                break;
            case 'right':
                // playerPosition.x = Math.min(gridX - 1, playerPosition.x + steps); // Even better, good concise would do again
                newX += step;
                break;
            case 'up':
                // playerPosition.y = Math.max(0, playerPosition.y - steps); // OMG can it get any better!
                newY -= step;
                break;
            case 'down':
                // playerPosition.y = Math.min(gridY - 1, playerPosition.y + steps); // Horrid please remove in the future, who even made this!!
                newY += step;
                break;
            default:
                console.error('Unknown direction:', direction);
                return;
        }

        // Collision detection to not go out of bounds
        if (newX < 0 || newX >= gridX || newY < 0 || newY >= gridY)
        {
            return;
        }

        // Collision detection for the obstacles
        if (!canWalk(newY * gridX + newX))
        {
            return;
        }

        if (pickedUpKey(newY * gridX + newX))
        {
            keyPickup = true;
        }

        if (reachedGoal(newY * gridX + newX))
        {
            console.log('Level Completed');
        }
    }

    playerPosition.x = newX;
    playerPosition.y = newY;

    renderPlayer();
    turn++;
    renderTurnCounter();
    checkGameOver();
    }
}
// #endregion


// Check if the path is clear this will be extended in the future for other obstacles
function canWalk(pathID)
{
    return !(isWall(pathID) || isDoor(pathID) && !keyPickup);
}

function pickedUpKey(pathID)
{
    return isKey(pathID);
}

function reachedGoal(pathID)
{
    return isGoal(pathID);
}

function isWall(id)
{
    return hasTileClass(id, TILES.WALL)
}

function isDoor(id)
{
    return hasTileClass(id, TILES.DOOR)
}

function isKey(id)
{
    return hasTileClass(id, TILES.KEY)
}

function isGoal(id)
{
    return hasTileClass(id, TILES.GOAL)
}

function hasTileClass(id, tileClass)
{
    const cell = document.getElementById(`${TILES.CELL}-${id}`); // Find cell by id
    return cell ? cell.classList.contains(tileClass) : false; // Checks if cell id contains (placeholder) class.
}

// Keyboard controls
document.addEventListener('keydown', function (event)
{
    const step = 1; // Define step size or determine based on key
    switch (event.key)
    {
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

/*
 *  save() saves all the different tiles into the gameData object.
 *  Right now it is quite hard coded, some refactoring is needed.
 *  It also needs to be into a
 */

// #region Save/Load
function save(mapID)
{
    if (!mapID)
    {
        console.error("Map name is required to save.");
        return;
    }

    // Update the gameData object with the current state
    gameData.player = [PLAYER.item(0).id.split('-')[1], playerPosition];
    saveTiles(TILES.WALL, gameData.walls);
    saveTiles(TILES.DOOR, gameData.doors);
    saveTiles(TILES.KEY, gameData.keys);
    saveTiles(TILES.GOAL, gameData.goal);

    // Save game data as JSON under a specific key
    const saveData = JSON.stringify(gameData);
    localStorage.setItem(`${MAP_INDEX}_${mapID}`, saveData);

    // Update the map index list
    let mapIndex = JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
    if (!mapIndex.includes(mapID))
    {
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
    if (tile != null)
    {
        for (let i = 0; i < tile.length; i++) {
            savePlaceArray.push(tile[i].id.split('-')[1]);
        }
    }
}


// As save() does most of the heavy lifting, load() is much more simple
function load(mapID)
{
    if (!mapID)
    {
        console.error("Map name is required to load.");
        return;
    }

    const loadData = localStorage.getItem(`${MAP_INDEX}_${mapID}`);
    if (!loadData)
    {
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

function getSavedMaps()
{
    return JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
}

function displaySavedMaps()
{
    const savedMaps = getSavedMaps();
    savedMaps.forEach(mapName =>
    {
        console.log(`Saved Map: ${mapName}`);
    });
}

function deleteMap(mapID)
{
    if (!mapID)
    {
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

function renderGame()
{
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


function removeTile(tileName)
{
    document.querySelectorAll(`.${tileName}`).forEach(tile => tile.classList.remove(tileName)); // Takes all the tiles and removes the name from the class
}


// This needs an array to iterate over
function addTile(tileName, array)
{
    for (let i = 0; i < array.length; i++)
    {
        let cell = document.getElementById(`${TILES.CELL}-${array[i]}`);
        if (cell)
        {
            cell.classList.add(tileName);
        }
    }
}

function resetAllSavedMaps()
{
    localStorage.removeItem(MAP_INDEX);
    playerPosition = { x: 0, y: 0 };
    keyPickup = false;
    gameData = { player: [], walls: [], keys: [], doors: [], goal: [] };
    renderGame();
    renderPlayer();
    turn = 1;
    renderTurnCounter();
}

function shadowPalette(elevation = "medium", color = "0 0% 63%")
{
    if (elevation === "low")
    {
        return `0.3px 0.5px 0.7px hsl(${color} / 0.34), 0.4px 0.8px 1px -1.2px hsl(${color} / 0.34), 1px 2px 2.5px -2.5px hsl(${color} / 0.34)`
    }
    else if (elevation === "medium")
    {
        return `0.3px 0.5px 0.7px hsl(${color} / 0.36), 0.8px 1.6px 2px -0.8px hsl(${color} / 0.36), 2.1px 4.1px 5.2px -1.7px hsl(${color} / 0.36), 5px 10px 12.6px -2.5px hsl(${color} / 0.36)`
    }
}

function createShadows()
{
    let controlpanelStyle = document.querySelectorAll(".controlpanel");
    for (let i = 0; i < controlpanelStyle.length; i++)
    {
        controlpanelStyle[i].style.boxShadow = shadowPalette("low", "0 0% 51%");
    }

    let controlpanelCard = document.querySelectorAll(".controlpanel-card");
    for (let i = 0; i < controlpanelCard.length; i++)
    {
        controlpanelCard[i].style.boxShadow = shadowPalette("medium", "0 0% 63%");
    }
}

function buttonEffects()
{
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("mouseover", function(e)
        {
            e.target.style.background = "hsl(158 95% 53%)";
        });
        buttons[i].addEventListener("mouseleave", function(e)
        {
            e.target.style.background = "hsl(158 95% 40%)";
        });
        buttons[i].addEventListener("click", function(e)
        {
            e.target.style.background = "hsl(44 95% 70%)";
        });
    }
}


function buttonMove() {
    let buttons = document.querySelectorAll(".run-button");
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("click", buttonMovement);
    }
}

function buttonMovement(event)
{
    let dir = event.srcElement.id.split('-')[1]; // Take the id of the button element splitting it at take the second elemet, which is either 'left', 'right', 'up' or 'down'
    let steps = event.srcElement.parentNode.childNodes[1].childNodes[0].value; // Get the source elements parent then the span child object then the child input and the value of it. Quite hard coded but it works.
    move(dir, steps);
}

function levelSelecting(mapID)
{
    document.getElementById('controls').style.display = 'block';
    load(mapID)
    initializeGrid(10, 5);
}


// Initialize the game
createShadows();
buttonEffects();
renderTurnCounter();
buttonMove();


