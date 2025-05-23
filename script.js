// Enhanced JavaScript for modern portfolio
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAOS();
        this.setupNavigation();
        this.loadGitHubProjects();
        this.updateFooter();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
        });

        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.updateScrollProgress();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                disable: 'mobile'
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');

        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }

    setupSmoothScrolling() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateScrollProgress() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe skill tags for staggered animation
        document.querySelectorAll('.skill-tag').forEach(tag => {
            observer.observe(tag);
        });
    }

    async loadGitHubProjects() {
        const projectsContainer = document.getElementById('github-projects');
        const username = 'seakyy';

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            const projects = await response.json();

            if (Array.isArray(projects)) {
                this.displayProjects(projects, projectsContainer);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error loading GitHub projects:', error);
            this.displayError(projectsContainer);
        }
    }

    displayProjects(projects, container) {
        container.innerHTML = '';

        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            container.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        const updatedDate = new Date(project.updated_at).toLocaleDateString();
        const language = project.language || 'Unknown';

        card.innerHTML = `
            <h3><a href="${project.html_url}" target="_blank" rel="noopener noreferrer">${project.name}</a></h3>
            <p>${project.description || 'No description available.'}</p>
            <div class="project-meta">
                <span>Language: ${language}</span>
                <span>Updated: ${updatedDate}</span>
            </div>
        `;

        return card;
    }

    displayError(container) {
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load projects at the moment. Please try again later.</p>
            </div>
        `;
    }

    updateFooter() {
        const currentYear = document.getElementById('current-year');
        const currentTime = document.getElementById('current-time');

        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }

        if (currentTime) {
            this.updateTime();
            setInterval(() => this.updateTime(), 1000);
        }
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }

    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }

        // Refresh AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// Initialize the portfolio app
new PortfolioApp();

// Additional smooth animations
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';

        setTimeout(() => {
            heroTitle.innerHTML = originalText;
            heroTitle.classList.add('typing-animation');
        }, 500);
    }
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Debounced scroll and resize handlers
window.addEventListener('scroll', debounce(() => {
    // Additional scroll effects can be added here
}, 10));

window.addEventListener('resize', debounce(() => {
    // Additional resize effects can be added here
}, 250));
