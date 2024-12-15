document.addEventListener('DOMContentLoaded', function() {
    window.hasPressedOnInputFields = false;

    function handlePressOnInput() {
        let hasPressedOnInputFields = true;
        console.log('Input field clicked:', hasPressedOnInputFields);
    }

    function addEventListeners() {
        const functionFields = document.querySelectorAll('.function-input-field');
        functionFields.forEach(field => {
            field.addEventListener('click', handlePressOnInput);
        });
    }

    function loadHTML(elementID, filePath, callback) {
        const element = document.getElementById(elementID);
        if (element) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    element.innerHTML = xhr.responseText;
                    if (callback) {
                        callback();
                    }
                }
            };
            xhr.send();
        }
    }

    loadHTML('header-container', '../../html/header.html', initGoBackButton);
    loadHTML('control-panel-container', '../../html/control-panel.html', addEventListeners);
    loadHTML('control-panel-container-2', '../../html/control-panel-2.html', addEventListeners);
    loadHTML('control-panel-container-6', '../../html/control-panel-unused.html', addEventListeners);
    loadHTML('modal-container-1', '../../html/modals/modal-1.html', addEventListeners);
    loadHTML('modal-container-2', '../../html/modals/modal-2.html', addEventListeners);
    loadHTML('modal-container-3', '../../html/modals/modal-3.html', addEventListeners);
    loadHTML('modal-container-4', '../../html/modals/modal-4.html', addEventListeners);
    loadHTML('modal-container-5', '../../html/modals/modal-5.html', addEventListeners);
    loadHTML('modal-container-6', '../../html/modals/modal-6.html', addEventListeners);
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

    if (button){
        button.addEventListener('animationend', function () {
            button.classList.add('show-button');
        });
    }
});

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

    if (pagesToShowButton.includes(currentPage)) {
        goBackButton.classList.add('show-go-back');
    }
    else {
        goBackButton.classList.remove('show-go-back');
    }
}

