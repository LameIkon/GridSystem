const INFOLIST = document.getElementById('mission-box'); // The location the json file will print its text
const INFO_MODAL = document.getElementById('info-mission-description');
const THEORYLIST = document.getElementById('theory-container'); // The location the json file will print its text


function displayLevelInfo(specifiedId) {
    // Clear the content before adding new content
    INFOLIST.innerHTML = '';

    fetch('../../json/level-info.json') // Find the location of the json file - Needs a live Server
        //fetch('https://johanpedersen11.github.io/jsonData/level-info.json') // Find the location of the json file
        .then(response => response.json()).then(info => {
        const FILTERED_ITEM = info.find(element => element.levelId === specifiedId) // Find the json file with the specific id 'levelId'

        if (FILTERED_ITEM) { // Take the json and read/use the data
            // Mission description
            INFOLIST.insertAdjacentHTML('beforeend', `<p id="mission">${FILTERED_ITEM.title}</p>`); // Print title text as a 'p'

            // Info Modal: Mission Objective
            INFO_MODAL.insertAdjacentHTML('beforeend', `<p id="mission-objective-text">${FILTERED_ITEM.body}</p>`);

            // Theory description
            THEORYLIST.insertAdjacentHTML('beforeend', `<p id="theory-header">${FILTERED_ITEM.theoryTitle}</p>`); // Print title text as a 'p'
            if (FILTERED_ITEM.theoryBox) // if there is an object. loop through and print it
            {
                Object.entries(FILTERED_ITEM.theoryBox).forEach(([key, value]) => {
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




    
