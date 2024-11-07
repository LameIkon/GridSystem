const GRID_ELEMENT = document.getElementById('grid');
const EDITOR_ELEMENT = document.getElementById('editor-tiles')
const PLAYER = document.getElementsByClassName('player');
const X_SIZE = document.getElementById('xsize');
const Y_SIZE = document.getElementById('ysize');

const MAP_INDEX = 'map_index'; // the place where it will save maps.

//#region Names for objects in the scene

// Error profing the tiles
const TILES = {
    CELL: 'cell',
    PLAYER: 'player',
    WALL: 'wall',
    DOOR: 'door',
    GOAL: 'goal',
    KEY: 'key'
};

// This is done to make it a list, as TILES is an object of objects it cannot be iterated over. This fixes that, not pretty!
const TILES_LIST =
[
    TILES.CELL,
    TILES.PLAYER,
    TILES.WALL,
    TILES.DOOR,
    TILES.GOAL,
    TILES.KEY
]


//#endregion

//#region Game Data

// Collection of the data to save for each map, this will most likly be expanded in the future

var game_data = {
            player: [], 
            walls: [], 
            keys: [],
            doors: [], 
            goal: [],
            size: {x: 0, y: 0}
        };

//#endregion

var grid_x; // columns
var grid_y; // rows
let player_position = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;


X_SIZE.addEventListener("change", resize_grid);
Y_SIZE.addEventListener("change", resize_grid);

function resize_grid()
{
    
    let cells = GRID_ELEMENT.childNodes;

    // THIS IS TERRIBLE, I (Troels) know how to fix it. BUT JavaScript is not willing to help!!
    let counter = 10; // A resonably large number to iterate over
    for(let i = 0; i < counter; i++) // iterate the horrible code
    {
        cells.forEach(cell => cell.remove()); // This removes abount half of the cells
    }

    init_grid(X_SIZE.value, Y_SIZE.value);

    // This is how it could be done in a nice readable and efficient way, but I cannot get the remove() or removeChild()
    // to work outside of the console in the browser.  
    /* 
    for(let i = cells.length; i > -1; i--)  
    {
        console.log(cells[i]);
        cells[i].remove(this);
    }
    */

}

function init_grid(x, y)
{
    grid_x = x;
    grid_y = y;
        // Setting the Grid variables dynamicliy in the CSS
    document.documentElement.style.setProperty('--y',grid_x); 
    document.documentElement.style.setProperty('--x',grid_y);
    create_grid();
}

create_editor_grid();

function create_editor_grid() {
    document.documentElement.style.setProperty('--g', TILES.length-1); // -1 because the first element is 'cell' which is not needed.

    for(let i = 1; i < TILES_LIST.length; i++){ // Starts at 1 because 'cell' is the first element
        let CELL = document.createElement('div');
        CELL.classList.add(TILES.CELL);
        CELL.classList.add(TILES_LIST[i]);
        CELL.id = `${TILES_LIST[i]}`;
        EDITOR_ELEMENT.appendChild(CELL);
        CELL.addEventListener('click', get_cell_type);
    }
}


/** This function gets the id of the editor element. Then sets it in the editor_cell variable,
 *  the variable is used to switch the cells on the grid, to the desired one.
 */
let editor_cell = null;
function get_cell_type(event)
{
    if(editor_cell != event.srcElement.id){
        editor_cell=event.srcElement.id;
        console.log(editor_cell);
    }
}

/** Gets the class list of a cell then resets it, then sets the desired cell
 * 
 */
function make_cell_switch(event)
{
    let cell_types = event.srcElement.classList;
    reset_cell(event);
    if(cell_types[1] == null && editor_cell != null)
    {
        cell_types.add(editor_cell);
    }
    console.log(cell_types[0]);
}

function reset_cell(event)
{
    console.log(4);
    let cell_types = event.srcElement.classList; 
    let type = cell_types[1];
    if(type != null)
    {
        cell_types.remove(type);
    }
}

// creating the grid (good comment!)
function create_grid() {
    for (let row = 0; row < grid_y; row++) {
        for(let col = 0; col < grid_x; col++){
            let CELL = document.createElement('div');
            CELL.classList.add(TILES.CELL);
            CELL.id = `${TILES.CELL}-${row * grid_x + col}`; // Multiply the rows with the amount of colums then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
            CELL.addEventListener('click', make_cell_switch); // Setting an event to make the cell switch to the currently selected
            CELL.addEventListener('dblclick', reset_cell); // Setting the cell back to normal
        }
    }
}

// Render the player on the grid
function render_player() {
    // Clear previous player positions
    document.querySelectorAll(`.${TILES.PLAYER}`).forEach(player => player.classList.remove(TILES.PLAYER));

    let index = player_position.y * grid_x + player_position.x;
    let player_cell = document.getElementById(`${TILES.CELL}-${index}`);
    if (player_cell) {
        player_cell.classList.add(TILES.PLAYER);
    }
}


function has_tile_class(id, tileClass){
    const cell = document.getElementById(`${TILES.CELL}-${id}`); //find cell by id
    return cell ? cell.classList.contains(tileClass) : false; //checks if cell id contains (placeholder) class.
}



/**
 * The save function saves all the different tiles into the game_data object. 
 * Right now it is quite hard coded, some refactoring is needed. 
 * It also needs to be into a 
*/
function save(mapID)
{
    if (!mapID) {
        console.error("Map name is required to save.");
        return;
    }

    // Update the game_data object with the current state
    game_data.player = [PLAYER.item(0).id.split('-')[1], player_position];
    save_tiles(TILES.WALL, game_data.walls);
    save_tiles(TILES.DOOR, game_data.doors);
    save_tiles(TILES.KEY, game_data.keys);
    save_tiles(TILES.GOAL, game_data.goal);

    // Save game data as JSON under a specific key
    const saveData = JSON.stringify(game_data);
    localStorage.setItem(`${MAP_INDEX}_${mapID}`, saveData);

    // Update the map index list
    let mapIndex = JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
    if (!mapIndex.includes(mapID)) {
        mapIndex.push(mapID);
        localStorage.setItem(MAP_INDEX, JSON.stringify(mapIndex));
    }

    console.log(`Map "${mapID}" saved.`);
}

/**
 * save_tiles is responsible for saving the different tiles.
 * Right now it can only save into arrays.
*/
function save_tiles(tile_name, save_place_array)
{
    let tile = document.querySelectorAll(`.${tile_name}`); // Getting all the tiles with the class {tile_name}, 
    if(tile != null)
    {
        for(let i = 0; i < tile.length; i++)
        {
            save_place_array.push(tile[i].id.split('-')[1]);
        }
    }
}

/**
 * As the save function does most of the heavy lifting the load is much more simple
 */
function load(mapID)
{
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
    game_data = JSON.parse(loadData);
    player_position = game_data.player[1];

    render_game();
    render_player();
    console.log(`Map "${mapID}" loaded.`);

}

function getSavedMaps() {
    const mapIndex = JSON.parse(localStorage.getItem(MAP_INDEX)) || [];
    return mapIndex;
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

function render_game()
{
    remove_tile(TILES.PLAYER);
    remove_tile(TILES.WALL);
    remove_tile(TILES.KEY);
    remove_tile(TILES.DOOR);
    remove_tile(TILES.GOAL);

    add_tile(TILES.WALL, game_data.walls);
    add_tile(TILES.KEY, game_data.keys);
    add_tile(TILES.DOOR, game_data.doors);
    add_tile(TILES.GOAL, game_data.goal);   
}


function remove_tile(tile_name)
{
    // Takes all the tiles and removes the name from the class
    document.querySelectorAll(`.${tile_name}`).forEach(tile => tile.classList.remove(tile_name));
}


/**
 * This needs an array to iterate over
*/
function add_tile(tile_name, array)
{
    for(let i = 0; i < array.length; i++)
    {
        let cell = document.getElementById(`${TILES.CELL}-${array[i]}`);
        if (cell) {
            cell.classList.add(tile_name);
        }
    }
}

function reset_all_saved_maps() {
    localStorage.removeItem(MAP_INDEX);
    player_position = { x: 0, y: 0 };
    key_pickup = false;
    game_data = { player: [], walls: [], keys: [], doors: [], goal: [] };
    render_game();
    render_player();
    turn = 1;
}

// Initialize the game
init_grid(X_SIZE.value, Y_SIZE.value);