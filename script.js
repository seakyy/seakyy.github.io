document.addEventListener("DOMContentLoaded", function () {
    const username = "seakyy";
    const repoContainer = document.getElementById("github-projects");

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            repoContainer.innerHTML = "";
            repos.slice(0, 5).forEach(repo => {
                const project = document.createElement("div");
                project.classList.add("project");
                project.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || "No description available."}</p>
                `;
                repoContainer.appendChild(project);
            });
        })
        .catch(error => {
            console.error("Error fetching GitHub repositories:", error);
            repoContainer.innerHTML = "Failed to load projects.";
        });
});
