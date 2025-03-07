/**
 * Portfolio functionality
 * Current User: seakyy
 * Current Date: 2025-03-07 13:01:54
 */

document.addEventListener("DOMContentLoaded", function () {
    updateCurrentYear();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    fetchGitHubRepos();
    setupBackToTopButton();
    setupSmoothScrolling();
    setupThemeToggle();
    setupHeaderScroll();
    setupKeyboardShortcuts();
});


function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}


function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substring(0, 19);
    document.getElementById('current-time').textContent = timeString;
}


function fetchGitHubRepos() {
    const username = document.getElementById('current-user').textContent || "seakyy";
    const repoContainer = document.getElementById("github-projects");

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            displayRepos(repos, repoContainer);
        })
        .catch(error => {
            displayError(error, repoContainer);
        });
}

/**
 * Displays repositories in the container
 * @param {Array} repos - List of repositories
 * @param {HTMLElement} container - Container element for repos
 */
function displayRepos(repos, container) {
    if (repos.length === 0) {
        container.innerHTML = "<p>No repositories found.</p>";
        return;
    }

    container.innerHTML = "";
    repos.forEach(repo => {
        const project = document.createElement("div");
        project.classList.add("project");

        // Format date
        const updatedDate = new Date(repo.updated_at);
        const formattedDate = updatedDate.toLocaleDateString();

        project.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
            <p>${repo.description || "No description available."}</p>
            <div class="project-meta">
                <span>${repo.language || "Various"}</span>
                <span>Updated: ${formattedDate}</span>
            </div>
        `;
        container.appendChild(project);
    });
}

/**
 * Displays error message when fetching repos fails
 * @param {Error} error - Error object
 * @param {HTMLElement} container - Container element for error message
 */
function displayError(error, container) {
    console.error("Error fetching GitHub repositories:", error);
    container.innerHTML = `
        <div class="error-message">
            <p>Failed to load projects. Please try again later.</p>
            <p>Error: ${error.message}</p>
        </div>
    `;
}


function setupBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');

    // Initially hide the button
    backToTopButton.style.display = 'none';

    backToTopButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide the button based on scroll position
    window.addEventListener('scroll', function () {
        backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
}


function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}


function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');

    // Apply saved theme or check system preference
    applyThemePreference();

    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            // Switch to light theme
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });


    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            }
        });
    }
}

/**
 * Applies the saved theme preference or uses system preference
 */
function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    }
}

function setupHeaderScroll() {
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}


function setupKeyboardShortcuts() {
    // Theme toggle with Ctrl+Alt+T
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.altKey && e.key === 't') {
            document.getElementById('theme-toggle').click();
        }
    });
}