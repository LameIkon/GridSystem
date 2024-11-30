const INFOLIST = document.getElementById('mission-box'); // The location the json file will print its text
const THEORYLIST = document.getElementById('theory-container'); // The location the json file will print its text

function displayLevelInfo(specifiedId)
{
// Clear the content before adding new content
INFOLIST.innerHTML = '';

fetch('../../json/level-info.json') // Find the location of the json file - Needs a live Server
//fetch('https://johanpedersen11.github.io/jsonData/level-info.json') // Find the location of the json file
    .then(response => response.json())
    .then(info =>
        {            
        const FILTEREDITEM = info.find(element => element.levelId === specifiedId) // Find the json file with the specific id 'levelId'
        
        if(FILTEREDITEM) // Take the json and read/use the data
        {
            // Mission description
            INFOLIST.insertAdjacentHTML('beforeend', `<p id="mission">${FILTEREDITEM.title}</p>`); // Print title text as a 'p'
            INFOLIST.insertAdjacentHTML('beforeend', `<p id="mission-description">${FILTEREDITEM.body}</p>`); // Print body text as a 'p'
            
             // Theory description
             THEORYLIST.insertAdjacentHTML('beforeend', `<p id="theory-header">${FILTEREDITEM.theoryTitle}</p>`); // Print title text as a 'p'
             if (FILTEREDITEM.theoryBox) // if there is an object. loop through and print it
                {               
                    Object.entries(FILTEREDITEM.theoryBox).forEach(([key,value]) => {
                        THEORYLIST.insertAdjacentHTML('beforeend', `<p id="theory-body">${value}</p>`);
                    });
                }
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




    
