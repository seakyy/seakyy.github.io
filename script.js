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



class EnhancedCyberEffects {
    constructor() {
        this.codeRainContainer = null;
        this.isActive = false;
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('⚡ Initializing Enhanced Cyber Effects...');
        
        setTimeout(() => {
            this.createCodeRainContainer();
            this.setupCyberSwitch();
            this.preloadCodeRain();
            this.addEffectStyles();
            this.isInitialized = true;
            console.log('✅ Enhanced Cyber Effects fully initialized');
        }, 100);
    }

    addEffectStyles() {
        // Add CSS keyframes only for effects
        if (!document.querySelector('#enhanced-cyber-effects-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-cyber-effects-styles';
            style.textContent = `
                @keyframes enhanced-cyber-code-fall {
                    from {
                        transform: translateY(-200px);
                        opacity: 0;
                    }
                    15% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 1;
                    }
                    to {
                        transform: translateY(calc(100vh + 200px));
                        opacity: 0;
                    }
                }
                
                @keyframes enhanced-cyber-circuit-fade {
                    0% { opacity: 0; transform: scale(1); }
                    25% { opacity: 0.5; transform: scale(1.02); }
                    75% { opacity: 0.5; transform: scale(0.98); }
                    100% { opacity: 0; transform: scale(1); }
                }

                @keyframes enhanced-cyber-data-pulse {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createCodeRainContainer() {
        // Remove existing container if any
        const existing = document.getElementById('enhancedCyberCodeRain');
        if (existing) {
            existing.remove();
        }

        const codeRain = document.createElement('div');
        codeRain.id = 'enhancedCyberCodeRain';
        codeRain.className = 'enhanced-cyber-code-rain';
        codeRain.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
            transition: opacity 1.5s ease;
        `;

        document.body.appendChild(codeRain);
        this.codeRainContainer = codeRain;
        console.log('✅ Enhanced cyber code rain container created');
    }

    preloadCodeRain() {
        this.generateCodeRain();
    }

    generateCodeRain() {
        if (!this.codeRainContainer) {
            console.error('❌ Enhanced cyber code rain container not found');
            return;
        }

        this.codeRainContainer.innerHTML = '';

        const cyberTerms = [
            'FIREWALL', 'ENCRYPTION', 'MALWARE', 'PHISHING', 'EXPLOIT',
            'VULNERABILITY', 'PENETRATION', 'BACKDOOR', 'TROJAN', 'ROOTKIT',
            'DDOS', 'BOTNET', 'RANSOMWARE', 'KEYLOGGER', 'SPYWARE',
            'INTRUSION', 'AUTHENTICATION', 'AUTHORIZATION', 'PKI', 'SSL/TLS',
            'IDS/IPS', 'SIEM', 'SOC', 'INCIDENT', 'FORENSICS',
            'THREAT', 'RISK', 'COMPLIANCE', 'GOVERNANCE', 'AUDIT',
            '0x41414141', '0xDEADBEEF', 'SHELL', 'ROOT', 'ADMIN',
            'CRYPTO', 'HASH', 'SALT', 'NONCE', 'CIPHER',
            'METASPLOIT', 'NMAP', 'WIRESHARK', 'BURP', 'KALI',
            'ZERO-DAY', 'APT', 'C2', 'PAYLOAD', 'SANDBOX',
            'HONEYPOT', 'WAF', 'EDR', 'XSS', 'CSRF'
        ];

        const columns = Math.floor(window.innerWidth / 35);

        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'enhanced-cyber-code-column';
            column.style.cssText = `
                position: absolute;
                top: -200px;
                left: ${i * 35}px;
                font-family: 'Courier New', 'Share Tech Mono', monospace;
                font-size: ${10 + Math.random() * 6}px;
                color: #ffc107;
                white-space: pre-line;
                animation: enhanced-cyber-code-fall ${3 + Math.random() * 3}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                text-shadow: 0 0 8px rgba(255, 193, 7, 0.9), 0 0 15px rgba(255, 235, 59, 0.7);
                line-height: 1.4;
                text-align: center;
                font-weight: bold;
            `;

            let text = '';
            for (let j = 0; j < 10; j++) {
                const term = cyberTerms[Math.floor(Math.random() * cyberTerms.length)];
                text += term + '\n';
            }
            column.textContent = text;

            this.codeRainContainer.appendChild(column);
        }
        console.log('✅ Enhanced cyber code rain generated with', columns, 'columns');
    }

    setupCyberSwitch() {
        // Find cyber switch button (ohne es zu stylen!)
        let cyberSwitch = document.getElementById('cyberSwitch') ||
                         document.querySelector('.cyber-switch') ||
                         document.querySelector('a[href="https://portfolio.koteski.ch"]');

        if (!cyberSwitch) {
            console.error('❌ Cyber switch button not found! Retrying in 1 second...');
            setTimeout(() => this.setupCyberSwitch(), 1000);
            return;
        }

        console.log('✅ Cyber switch button found:', cyberSwitch);

        // WICHTIG: Button-Styling NICHT ändern, nur Event-Listener hinzufügen
        cyberSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚡ Cyber switch clicked!');

            if (!this.isActive) {
                this.activateCyberMode();
            }
        });

        console.log('✅ Cyber switch event listener attached (without styling changes)');
    }

    activateCyberMode() {
        if (this.isActive) return;
        this.isActive = true;

        console.log('⚡ Enhanced Cyber mode activation started!');

        // Show cyber code rain
        if (this.codeRainContainer) {
            this.codeRainContainer.style.opacity = '1';
            this.codeRainContainer.classList.add('active');
            console.log('🌧️ Enhanced cyber code rain activated');
        }

        // Create effects
        this.createScreenFlash();
        this.createCircuitEffect();
        this.createDataStream();

        // Redirect after effects
        setTimeout(() => {
            console.log('🔄 Redirecting to koteski.ch...');
            window.location.href = 'https://koteski.ch';
        }, 1800);

        // Cleanup
        setTimeout(() => {
            if (this.codeRainContainer) {
                this.codeRainContainer.style.opacity = '0';
                this.codeRainContainer.classList.remove('active');
            }
            this.isActive = false;
        }, 4000);
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ffc107, #ffeb3b, #ffca28);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0.6';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(flash)) {
                        document.body.removeChild(flash);
                    }
                }, 300);
            }, 400);
        }, 200);

        console.log('🟡 Yellow screen flash created');
    }

    createCircuitEffect() {
        const circuit = document.createElement('div');
        circuit.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            background:
                radial-gradient(circle at 25% 25%, rgba(255, 193, 7, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 235, 59, 0.3) 0%, transparent 50%),
                linear-gradient(90deg, transparent 48%, #ffc107 49%, #ffc107 51%, transparent 52%),
                linear-gradient(0deg, transparent 48%, #ffeb3b 49%, #ffeb3b 51%, transparent 52%);
            background-size: 80px 80px, 80px 80px, 30px 30px, 30px 30px;
            opacity: 0;
            animation: enhanced-cyber-circuit-fade 2s ease-in-out;
        `;

        document.body.appendChild(circuit);

        setTimeout(() => {
            if (document.body.contains(circuit)) {
                document.body.removeChild(circuit);
            }
        }, 2000);

        console.log('⚡ Enhanced cyber circuit effect created');
    }

    createDataStream() {
        const stream = document.createElement('div');
        stream.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Courier New', 'Share Tech Mono', monospace;
            font-size: 1.2rem;
            color: #ffeb3b;
            text-shadow: 0 0 20px #ffc107;
            z-index: 9999;
            pointer-events: none;
            animation: enhanced-cyber-data-pulse 1.5s ease-in-out;
            font-weight: bold;
            letter-spacing: 2px;
        `;
        stream.textContent = '>>> SWITCHING TO CYBER MODE <<<';

        document.body.appendChild(stream);

        setTimeout(() => {
            if (document.body.contains(stream)) {
                document.body.removeChild(stream);
            }
        }, 1500);

        console.log('📡 Enhanced cyber data stream created');
    }

    handleResize() {
        if (this.isInitialized) {
            this.generateCodeRain();
        }
    }
}

// Initialize enhanced cyber effects - ersetzt die alte CyberEffects Klasse
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ DOM Content Loaded - Initializing Enhanced Cyber Effects...');
    
    const enhancedCyberEffects = new EnhancedCyberEffects();
    window.enhancedCyberEffects = enhancedCyberEffects;

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.enhancedCyberEffects && window.enhancedCyberEffects.isInitialized) {
            window.enhancedCyberEffects.handleResize();
        }
    });

    console.log('✅ Enhanced cyber effects initialized successfully!');
});


