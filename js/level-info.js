const INFOLIST = document.getElementById('mission-description'); // The location the json file will print its text


function displayLevelInfo(specifiedId)
{
// Clear the content before adding new content
INFOLIST.innerHTML = '';

//fetch('../json/level-info.json') // Find the location of the json file - Needs a live Server
fetch('https://johanpedersen11.github.io/jsonData/level-info.json') // Find the location of the json file
    .then(response => response.json())
    .then(info =>
        {            
        const FILTEREDITEM = info.find(element => element.levelId === specifiedId) // Find the json file with the specific id 'levelId'
        
        if(FILTEREDITEM) // Take the json and read/use the data
        {
            INFOLIST.insertAdjacentHTML('beforeend', `<p>${FILTEREDITEM.title}</p>`); // Print title text as a 'h2'
            INFOLIST.insertAdjacentHTML('beforeend', `<p>${FILTEREDITEM.body}</p>`); // Print body text as a 'p'
        }
        else // Error message
        {
            INFOLIST.insertAdjacentHTML('beforeend', `<p>Error</p>`); // Print title text as a 'h2'
            INFOLIST.insertAdjacentHTML('beforeend', `<p>Unknown id</p>`); // Print body text as a 'p'
        }
        });       
}
// Initialize
//displayLevelInfo(0); // Insert id for specified level info to be loaded




    
