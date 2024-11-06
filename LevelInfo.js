function displayLevelInfo(specifiedId)
{
    let infoList = document.querySelector('.missionDescription'); // The location the json file will print its text

    fetch('./LevelInfo.json') // Find the location of the json file
        .then(response => response.json())
        .then(info =>
            {            
            const FILTEREDITEM = info.find(element => element.levelId === specifiedId) // Find the json file with the specific id 'levelId'
            
            if(FILTEREDITEM) // Take the json and read/use the data
            {
                infoList.insertAdjacentHTML('beforeend', `<h2>${FILTEREDITEM.title}</h2>`); // Print title text as a 'h2'
                infoList.insertAdjacentHTML('beforeend', `<p>${FILTEREDITEM.body}</p>`); // Print body text as a 'p'
            }
            else // Error message
            {
                infoList.insertAdjacentHTML('beforeend', `<h2>Error</h2>`); // Print title text as a 'h2'
                infoList.insertAdjacentHTML('beforeend', `<p>Unknown id</p>`); // Print body text as a 'p'
            }
            });       
}

// Initialize
displayLevelInfo(1); // Insert id for specified level info to be loaded