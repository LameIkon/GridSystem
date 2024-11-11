// AJAX Call
document.addEventListener('DOMContentLoaded', function () {
    function loadHTML(elementID, filePath) {
        const element = document.getElementById(elementID);
        if (element) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    element.innerHTML = xhr.responseText;
                }
            };
            xhr.send();
        }
    }
    loadHTML('header-container', '../header.html');
    loadHTML('header-container', 'header.html');
    loadHTML('header-container', '../html/header.html');
    loadHTML('controlpanel', '../control-panel.html')
});


// CSS Class Load
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// CSS Class Load
document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById('play-now-button');
    button.addEventListener('animationend', function() {
        button.classList.add('show-button');
    });
});


// JOHANS code, does not work yet. Maybe fix at some point!

/*

const INFOLIST = document.getElementById('mission-description'); // The location the json file will print its text


document.addEventListener('DOMContentLoaded', displayLevelInfo(document.getElementById('main-heading').childNodes[1].innerHTML.split(' ')[1]));


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
*/