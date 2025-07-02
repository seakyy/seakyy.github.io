// Enhanced JavaScript for modern portfolio with stable hero section
class PortfolioApp {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAOS();
        this.setupNavigation();
        this.loadGitHubProjects();
        this.updateFooter();
        this.setupScrollEffects();
        this.setupMobileOptimizations();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.handleViewportMeta();
        });

        window.addEventListener('scroll', this.debounce(() => {
            this.handleNavbarScroll();
            this.updateScrollProgress();
        }, 10));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Touch events for mobile
        if (this.isTouch) {
            document.addEventListener('touchstart', () => { }, { passive: true });
        }
    }

    handleViewportMeta() {
        // Ensure proper viewport scaling on mobile
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }

    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: this.isMobile ? 600 : 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: this.isMobile ? 50 : 100,
                disable: false,
                mobile: {
                    duration: 600,
                    offset: 50
                }
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
                    const offsetTop = targetSection.offsetTop - (this.isMobile ? 70 : 80);
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });

        // Active link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', this.debounce(() => {
            this.updateActiveNavLink();
        }, 100));
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');

                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        const body = document.body;

        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        }
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;

        if (scrolled) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            navbar.classList.remove('scrolled');
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

            // Show/hide back to top button
            window.addEventListener('scroll', this.debounce(() => {
                if (window.scrollY > 300) {
                    backToTop.style.opacity = '1';
                    backToTop.style.pointerEvents = 'auto';
                } else {
                    backToTop.style.opacity = '0';
                    backToTop.style.pointerEvents = 'none';
                }
            }, 100));
        }
    }

    updateScrollProgress() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    }

    setupScrollEffects() {
        // FIXED: Completely removed parallax effect for stable hero section
        // The hero section will now stay perfectly in place on all devices

        // Ensure hero section is always stable
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = 'none';
            hero.style.position = 'relative';
            hero.style.willChange = 'auto';
        }

        // Intersection Observer for animations (keeping the smooth animations for other elements)
        const observerOptions = {
            threshold: this.isMobile ? 0.05 : 0.1,
            rootMargin: this.isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations (excluding hero)
        document.querySelectorAll('.skill-tag, .project, .skill-category').forEach(element => {
            observer.observe(element);
        });
    }

    setupMobileOptimizations() {
        // Mark mobile devices
        if (this.isMobile || this.isTouch) {
            document.body.classList.add('mobile-device');
            document.documentElement.classList.add('mobile-device');
        }

        // Optimize for mobile performance
        if (this.isMobile) {
            // Reduce animation complexity
            document.documentElement.style.setProperty('--transition-base', '0.2s ease-out');

            // Disable hover effects on touch devices
            if (this.isTouch) {
                document.documentElement.classList.add('touch-device');
            }

            // Fix viewport height for mobile browsers (address bar issue)
            this.setMobileVH();
        }

        // Handle orientation change
        window.addEventListener('orientationchange', this.debounce(() => {
            setTimeout(() => {
                this.setMobileVH();
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
                this.handleResize();
            }, 100);
        }, 250));
    }

    setMobileVH() {
        // Fix for mobile viewport height issues
        if (this.isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }

    async loadGitHubProjects() {
        const projectsContainer = document.getElementById('github-projects');
        const username = 'seakyy';

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${this.isMobile ? 4 : 6}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const projects = await response.json();

            if (Array.isArray(projects) && projects.length > 0) {
                this.displayProjects(projects, projectsContainer);
            } else {
                throw new Error('No projects found');
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
        card.setAttribute('data-aos-delay', `${index * (this.isMobile ? 50 : 100)}`);

        const updatedDate = new Date(project.updated_at).toLocaleDateString();
        const language = project.language || 'Unknown';

        card.innerHTML = `
            <h3><a href="${project.html_url}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(project.name)}</a></h3>
            <p>${this.escapeHtml(project.description || 'No description available.')}</p>
            <div class="project-meta">
                <span>Language: ${this.escapeHtml(language)}</span>
                <span>Updated: ${updatedDate}</span>
            </div>
        `;

        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;

        // Update mobile state
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;

            if (this.isMobile) {
                document.body.classList.add('mobile-device');
            } else {
                document.body.classList.remove('mobile-device');
            }

            this.setupMobileOptimizations();
        }

        // Always ensure hero is stable on all devices
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = 'none';
            hero.style.position = 'relative';
            hero.style.willChange = 'auto';
        }

        // Close mobile menu on desktop
        if (!this.isMobile) {
            this.closeMobileMenu();
        }

        // Refresh AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Update viewport height for mobile browsers
        this.setMobileVH();
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the portfolio app
const portfolio = new PortfolioApp();

// Page load animations
document.addEventListener('DOMContentLoaded', () => {
    // Prevent flash of unstyled content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';

    // Fade in after DOM is ready
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Ensure hero is properly positioned on all devices
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'none';
        hero.style.position = 'relative';
        hero.style.willChange = 'auto';
    }
});

// Additional stability fixes
window.addEventListener('load', () => {
    // Double-check hero positioning after all resources are loaded
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'none !important';
        hero.style.position = 'relative';
        hero.style.willChange = 'auto';
    }
});

// Performance monitoring
if (window.performance && window.performance.mark) {
    window.addEventListener('load', () => {
        window.performance.mark('portfolio-loaded');

        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log(`Page load time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            }
        }, 0);
    });
}



//Cyber Effects Class
class CyberEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCyberSwitch();
        this.createMatrixRainContainer();
    }

    createMatrixRainContainer() {
        if (!document.getElementById('matrixRain')) {
            const matrixRain = document.createElement('div');
            matrixRain.id = 'matrixRain';
            matrixRain.className = 'matrix-rain';
            document.body.appendChild(matrixRain);
        }
    }

    createMatrixRain() {
        const matrixRain = document.getElementById('matrixRain');
        matrixRain.innerHTML = ''; // Clear existing columns

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]()><';
        const columns = Math.floor(window.innerWidth / 20);

        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = i * 20 + 'px';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';
            column.style.animationDelay = Math.random() * 2 + 's';

            let text = '';
            for (let j = 0; j < 20; j++) {
                text += chars[Math.floor(Math.random() * chars.length)];
            }
            column.textContent = text;

            matrixRain.appendChild(column);
        }
    }

    setupCyberSwitch() {
        const cyberSwitch = document.getElementById('cyberSwitch');
        if (!cyberSwitch) return;

        cyberSwitch.addEventListener('click', (e) => {
            this.activateCyberMode(e);
        });

        // Preload matrix rain
        this.createMatrixRain();
    }

    activateCyberMode(e) {
        e.preventDefault();

        // Activate matrix rain
        const matrixRain = document.getElementById('matrixRain');
        matrixRain.classList.add('active');

        // Create screen flash effect
        this.createScreenFlash();

        // Redirect after effects
        setTimeout(() => {
            window.location.href = 'https://koteski.ch';
        }, 800);

        // Remove matrix rain after some time
        setTimeout(() => {
            matrixRain.classList.remove('active');
        }, 2000);
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffc107;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.1s ease;
        `;
        document.body.appendChild(flash);

        // Flash sequence
        setTimeout(() => {
            flash.style.opacity = '0.3';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(flash);
                }, 100);
            }, 100);
        }, 50);
    }
}

// Initialize cyber effects when portfolio app is ready
if (typeof PortfolioApp !== 'undefined') {
    // Add to existing PortfolioApp init method
    const originalInit = PortfolioApp.prototype.init;
    PortfolioApp.prototype.init = function () {
        originalInit.call(this);
        this.cyberEffects = new CyberEffects();
    };
} else {
    // Standalone initialization
    document.addEventListener('DOMContentLoaded', () => {
        new CyberEffects();
    });
}

// Handle window resize for matrix rain
window.addEventListener('resize', () => {
    const cyberEffects = window.cyberEffects || new CyberEffects();
    cyberEffects.createMatrixRain();
});
