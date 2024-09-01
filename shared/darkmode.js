document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const githubLogo = document.querySelector('.github-logo');

    // Function to get a value from localStorage
    function getLocalStorage(key) {
        return localStorage.getItem(key);
    }

    // Function to set a value in localStorage
    function setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            setLocalStorage('darkMode', 'enabled');
            darkModeToggle.textContent = '☀️';
            githubLogo.src = 'media/github-mark.png'; // Change logo to dark mode
        } else {
            setLocalStorage('darkMode', 'disabled');
            darkModeToggle.textContent = '🌙';
            githubLogo.src = 'media/github-mark-white.png'; // Change logo to light mode
        }
    }

    // Add event listener to the toggle button
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Apply dark mode if localStorage is set
    if (getLocalStorage('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        githubLogo.src = 'media/github-mark.png'; // Change logo to dark mode
    } else {
        darkModeToggle.textContent = '🌙';
        githubLogo.src = 'media/github-mark-white.png'; // Change logo to light mode
    }
});
