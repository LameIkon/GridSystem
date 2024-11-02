const GRID_ELEMENT = document.getElementById('grid');
const PLAYER = document.getElementsByClassName('player');


const MAP_INDEX = 'map_index'; // the place where it will save maps.

var key_pickup = false;

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


//#endregion

//#region Game Data

// Collection of the data to save for each map, this will most likly be expanded in the future

var game_data = {
            player: [], 
            walls: [], 
            keys: [],
            doors: [], 
            goal: [],
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
            CELL.classList.add(TILES.CELL);
            CELL.id = `${TILES.CELL}-${row * grid_x + col}`; // Multiply the rows with the amount of colums then add the columns to each row
            GRID_ELEMENT.appendChild(CELL);
        }
    }
    render_player();
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

// Render the turn counter
function render_turn() {
    document.getElementById('turn-counter').innerText = turn;
}

// Handle movement
function move(direction, steps) {

    let new_x = player_position.x;
    let new_y = player_position.y;
    let step = 1;

    //This for loop makes sure that we only take one step at a time, to prevent 'jumping' over walls
    for(let i = 0; i < steps; i++)
    {   
        switch(direction) {
            case 'left':
            //player_position.x = Math.max(0, player_position.x - steps); // this just looks nice!! maybe it can be used again for floats
            new_x -= step;
            break;

            case 'right':
            //player_position.x = Math.min(grid_x - 1, player_position.x + steps); // even better, good consice would do again
            new_x += step;
            break;

            case 'up':
            //player_position.y = Math.max(0, player_position.y - steps); // OMG can it get any better!
            new_y -= step;
            break;

            case 'down':
            //player_position.y = Math.min(grid_y - 1, player_position.y + steps); // Horrid please remove in the furture, who even made this!!
            new_y += step;
            break;
            
            default:
            console.error('Unknown direction:', direction);
            return;
            }
                  
           
        // Collision detection to not go out of bounds    
        if (new_x < 0 || new_x >= grid_x || new_y < 0 || new_y >= grid_y) 
        {
            return;
        }
        

        // Collision detection for the obsticals
        if (!can_walk(new_y*grid_x + new_x))
        {
            return;
        }

        if (picked_up_key(new_y*grid_x + new_x))
        {
            key_pickup = true;
        }

        if(reached_goal(new_y*grid_x + new_x))
        {
            console.log('Level Completed');
        }
    }
                            
    player_position.x = new_x;
    player_position.y = new_y;


    render_player();
    turn++;
    render_turn();
}




 // Check if the path is clear this will be extended in the future for other obsticals
function can_walk(path_id) {
    if(is_wall(path_id) || is_door(path_id) && !key_pickup)
    {
        return false;
    }
    
    return true;
}

function picked_up_key(path_id){
    if(is_key(path_id))
    {
       return true;
    }
    return false;
}

function reached_goal(path_id){
    if(is_goal(path_id)){
        return true;
    }

    return false;
}


function is_wall(id)
{
    return has_tile_class(id, TILES.WALL)
}

function is_door(id)
{
    return has_tile_class(id, TILES.DOOR)
}

function is_key(id){
    return has_tile_class(id, TILES.KEY)
}

function is_goal(id){
    return has_tile_class(id, TILES.GOAL)
}

function has_tile_class(id, tileClass){
    const cell = document.getElementById(`${TILES.CELL}-${id}`); //find cell by id
    return cell ? cell.classList.contains(tileClass) : false; //checks if cell id contains (placeholder) class.
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
    render_turn();
}

function create_shadows() {
    const shadow_colors = [ // list for creating box shadows
        "0.3px 0.5px 0.7px hsl(0 0% 51% / 0.34), 0.4px 0.8px 1px -1.2px hsl(0 0% 51% / 0.34), 1px 2px 2.5px -2.5px hsl(0 0% 51% / 0.34)",
        "0.3px 0.5px 0.7px hsl(0 0% 63% / 0.36), 0.8px 1.6px 2px -0.8px hsl(0 0% 63% / 0.36), 2.1px 4.1px 5.2px -1.7px hsl(0 0% 63% / 0.36), 5px 10px 12.6px -2.5px hsl(0 0% 63% / 0.36)"
    ];

    let controlpanel_style = document.querySelector(".controlpanel").style;
    controlpanel_style.boxShadow = shadow_colors[0];

    let controlpanel_card = document.querySelectorAll(".controlpanel-card");
    for(let i = 0; i < controlpanel_card.length; i++){
        controlpanel_card[i].style.boxShadow = shadow_colors[1];
    } 
}

// Initialize the game
init_grid(10, 5);
render_turn();
create_shadows();
