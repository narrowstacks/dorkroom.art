document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const githubLogo = document.querySelector('.github-logo');

    // Function to get a cookie by name
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    // Function to set a cookie
    function setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            setCookie('darkMode', 'enabled', { 'max-age': 3600 * 24 * 365 });
            darkModeToggle.textContent = '☀️';
            githubLogo.src = 'media/github-mark.png'; // Change logo to dark mode
        } else {
            setCookie('darkMode', 'disabled', { 'max-age': 3600 * 24 * 365 });
            darkModeToggle.textContent = '🌙';
            githubLogo.src = 'media/github-mark-white.png'; // Change logo to light mode
        }
    }

    // Add event listener to the toggle button
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Apply dark mode if cookie is set
    if (getCookie('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        githubLogo.src = 'media/github-mark.png'; // Change logo to dark mode
    } else {
        darkModeToggle.textContent = '🌙';
        githubLogo.src = 'media/github-mark-white.png'; // Change logo to light mode
    }
});
