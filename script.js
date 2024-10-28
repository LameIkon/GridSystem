const GRID_ELEMENT = document.getElementById('grid');
const PLAYER = document.getElementsByClassName('player');


const SAVE_PLACE = 'the_save_place'; // the place where it will save the current map.

//#region Names for objects in the scene

// Error profing the strings
const CELL_NAME = 'cell'; 

const PLAYER_NAME = 'player';
const WALL_NAME = 'wall';
const DOOR_NAME = 'door';
const GOAL_NAME = 'goal';
const KEY_NAME = 'key';

//#endregion

//#region Game Data

// Collection of the data to save for each map, this will most likly be expanded in the future

var game_data = {
            player: [], 
            walls: [], 
            keys: [],
            doors: [], 
            goal: null
        };

//#endregion

var grid_x; // columns
var grid_y; // rows
let player_position = { x: 0, y: 0 }; // Starting at top-left corner
let turn = 1;


function init_grid(x, y)
{
    grid_x = x;
    grid_y = y;
        // Setting the Grid variables dynamicliy in the CSS
    document.documentElement.style.setProperty('--y',grid_x); 
    document.documentElement.style.setProperty('--x',grid_y);
    create_grid();
}


// creating the grid (good comment!)
function create_grid() {
    for (let row = 0; row < grid_y; row++) {
        for(let col = 0; col < grid_x; col++){
            const CELL = document.createElement('div');
            CELL.classList.add(CELL_NAME);
            CELL.id = `${CELL_NAME}-${row * grid_x + col}`; // Multiply the rows with the amount of colums then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
        }
    }
    render_player();
}

// Render the player on the grid
function render_player() {
    // Clear previous player positions
    document.querySelectorAll(`.${PLAYER_NAME}`).forEach(player => player.classList.remove(PLAYER_NAME));

    let index = player_position.y * grid_x + player_position.x;
    let player_cell = document.getElementById(`${CELL_NAME}-${index}`);
    if (player_cell) {
        player_cell.classList.add(PLAYER_NAME);
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
            player_position.x = Math.max(0, player_position.x - steps);
            break;
        case 'right':
            player_position.x = Math.min(grid_x - 1, player_position.x + steps);
            break;
        case 'up':
            player_position.y = Math.max(0, player_position.y - steps);
            break;
        case 'down':
            player_position.y = Math.min(grid_y - 1, player_position.y + steps);
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


/**
 * The save function saves all the different tiles into the game_data object. 
 * Right now it is quite hard coded, some refactoring is needed. 
 * It also needs to be into a 
*/
function save()
{
    game_data.player[0] = (PLAYER.item(0).id.split('-')[1]); // It is the cell number that is saved, here it's only getting the number
    game_data.player[1] = (player_position); 

    save_tiles(WALL_NAME, game_data.walls);
    save_tiles(DOOR_NAME, game_data.doors);
    save_tiles(KEY_NAME, game_data.keys);
    //save_tiles(GOAL_NAME, game_data.goal);

    let save_data = JSON.stringify(game_data); // Turnig the game_data into a .json
    localStorage.setItem(SAVE_PLACE, save_data); // Saving the .json on the local drive

    console.log('saved game');
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
            save_place_array[i] = tile[i].id.split('-')[1];
        }
    }
}

/**
 * As the save function does most of the heavy lifting the load is much more simple
 */
function load()
{
    let load_data = localStorage.getItem(SAVE_PLACE); // We get the data 

    if(load_data != null)
    {
        game_data = JSON.parse(load_data); // parsing the saved data into the game_data

        player_position = game_data.player[1];

        render_game();
        render_player();
        console.log('loaded game');
    }

}

function render_game()
{
    remove_tile(PLAYER_NAME);
    remove_tile(WALL_NAME);
    remove_tile(KEY_NAME);
    remove_tile(DOOR_NAME);
    remove_tile(GOAL_NAME);

    add_tile(WALL_NAME, game_data.walls);
    add_tile(KEY_NAME, game_data.keys);
    add_tile(DOOR_NAME, game_data.doors);
    
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
        let cell = document.getElementById(`${CELL_NAME}-${array[i]}`);
        if (cell) {
            cell.classList.add(tile_name);
        }
    }
}

// Initialize the game
init_grid(10, 5);
render_turn();
