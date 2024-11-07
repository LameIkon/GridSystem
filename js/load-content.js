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
});
