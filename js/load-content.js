document.addEventListener('DOMContentLoaded', function () {
    function loadHTML(elementID, filePath, callback) {
        const element = document.getElementById(elementID);
        if (element) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    element.innerHTML = xhr.responseText;
                    if (callback) {
                        console.log(`Callback called for ${elementID}`); // Debug
                        callback();
                    }
                }
            };
            xhr.send();
        }
    }

    // Load header and initialize the Go Back button
    loadHTML('header-container', '../../html/header.html', initGoBackButton);
    loadHTML('control-panel-container', '../../html/control-panel.html');
    loadHTML('control-panel-level-2-container', '../../html/control-panel-level-2.html');
    loadHTML('control-panel-level-3-container', '../../html/control-panel-level-3.html');
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
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById('play-now-button');
    button.addEventListener('animationend', function () {
        button.classList.add('show-button');
    });
});

// Initialize the "Go Back" button visibility
function initGoBackButton() {
    const goBackButton = document.getElementById('go-back');
    if (!goBackButton) {
        console.log('Go Back button not found'); // Debug
        return;
    }
    const currentPage = window.location.pathname.split('/').pop(); // Get the current page file name

    const pagesToShowButton = [
        'level-1.html',
        'level-2.html',
        'level-3.html',
        'level-4.html',
        'level-5.html',
        'level-6.html',
    ];

    // Check if the current page is in the list of pages where the button should be visible
    if (pagesToShowButton.includes(currentPage)) {
        console.log('Showing Go Back button'); // Debug
        goBackButton.classList.add('show-go-back');
    } else {
        console.log('Hiding Go Back button'); // Debug
        goBackButton.classList.remove('show-go-back'); // Ensure the button is hidden on other pages
    }
}

function goBack() {
    window.history.back(); // Go back to the previous page
}
