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
