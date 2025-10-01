/* ================================
   SMOOTH SCROLL FUNCTIONALITY
   ================================ */

// Initialize smooth scrolling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initScrollToTop();
    initActiveNavigation();
    initParallaxEffects();
});

/* ================================
   SMOOTH SCROLL TO SECTIONS
   ================================ */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Section with ID "${sectionId}" not found`);
        return;
    }
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    const targetPosition = section.offsetTop - headerHeight;
    
    // Smooth scroll with custom animation
    smoothScrollTo(targetPosition, 800);
    
    // Update URL hash
    if (history.pushState) {
        history.pushState(null, null, `#${sectionId}`);
    } else {
        window.location.hash = sectionId;
    }
}

function smoothScrollTo(targetPosition, duration = 600) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Easing function for smooth animation
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

/* ================================
   INITIALIZE SMOOTH SCROLLING
   ================================ */
function initSmoothScrolling() {
    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') return;
            
            e.preventDefault();
            const sectionId = href.substring(1);
            scrollToSection(sectionId);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash) {
            const sectionId = hash.substring(1);
            scrollToSection(sectionId);
        }
    });
    
    // Handle initial load with hash
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const sectionId = hash.substring(1);
                scrollToSection(sectionId);
            }, 100);
        }
    });
}

/* ================================
   SCROLL TO TOP BUTTON
   ================================ */
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = createScrollToTopButton();
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, 100));
    
    // Handle click
    scrollToTopBtn.addEventListener('click', function() {
        smoothScrollTo(0, 600);
    });
}

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color, #2c3e50);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    `;
    
    return button;
}

/* ================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ================================ */
function initActiveNavigation() {
    const sections = document.querySelectorAll('.page-section, section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (sections.length === 0 || navItems.length === 0) return;
    
    // Create intersection observer for active nav highlighting
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavItem(sectionId);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        if (section.id) {
            sectionObserver.observe(section);
        }
    });
}

function updateActiveNavItem(activeSectionId) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Remove active class from all items
        item.classList.remove('active');
        
        // Add active class to matching item
        const itemText = item.textContent.toLowerCase().trim();
        const sectionName = activeSectionId.toLowerCase();
        
        if ((itemText === 'home' && sectionName === 'home') ||
            (itemText === 'about' && sectionName === 'about') ||
            (itemText === 'portfolio' && sectionName === 'portfolio') ||
            (itemText === 'services & pricing' && sectionName === 'services') ||
            (itemText === 'blog' && sectionName === 'blog') ||
            (itemText === 'faq' && sectionName === 'faq') ||
            (itemText === 'contact' && sectionName === 'contact')) {
            
            item.classList.add('active');
        }
    });
}

/* ================================
   PARALLAX EFFECTS
   ================================ */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .testimonials');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            if (isElementInViewport(element)) {
                const rate = scrollTop * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    }, 16)); // ~60fps
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.bottom >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

/* ================================
   SCROLL PROGRESS INDICATOR
   ================================ */
function initScrollProgressIndicator() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, var(--primary-color, #2c3e50), var(--accent-color, #f39c12));
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.1s ease;
        z-index: 10001;
        width: 100%;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', throttle(function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = winScroll / height;
        
        progressBar.style.transform = `scaleX(${scrolled})`;
    }, 16));
}

/* ================================
   SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
   ================================ */
function initScrollPolyfill() {
    // Check if smooth scrolling is supported
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Add polyfill for older browsers
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                
                if (section) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                    const targetPosition = section.offsetTop - headerHeight;
                    
                    smoothScrollTo(targetPosition, 800);
                }
            });
        });
    }
}

/* ================================
   SCROLL ANIMATIONS (REVEAL ON SCROLL)
   ================================ */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(`
        .service-box,
        .portfolio-item,
        .package,
        .blog-item,
        .work-item,
        .testimonial-item
    `);
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add random delay for stagger effect
                    const delay = Math.random() * 300;
                    
                    setTimeout(() => {
                        element.classList.add('animate-in');
                    }, delay);
                    
                    // Stop observing this element
                    animationObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all elements
        animateElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animate-in');
        });
    }
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance optimization
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

// Get element's offset top
function getElementOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ================================
   HASH CHANGE HANDLING
   ================================ */
function initHashChangeHandling() {
    // Handle hash changes (browser navigation)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            const sectionId = hash.substring(1);
            const section = document.getElementById(sectionId);
            
            if (section) {
                setTimeout(() => {
                    scrollToSection(sectionId);
                }, 100);
            }
        }
    });
}

/* ================================
   KEYBOARD NAVIGATION
   ================================ */
function initKeyboardNavigation() {
    const sections = ['home', 'about', 'portfolio', 'services', 'blog', 'faq', 'contact'];
    let currentSectionIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Only handle if no input is focused
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' || 
            document.activeElement.tagName === 'SELECT') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
                scrollToSection(sections[currentSectionIndex]);
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
                scrollToSection(sections[currentSectionIndex]);
                break;
                
            case 'Home':
                e.preventDefault();
                currentSectionIndex = 0;
                scrollToSection(sections[0]);
                break;
                
            case 'End':
                e.preventDefault();
                currentSectionIndex = sections.length - 1;
                scrollToSection(sections[currentSectionIndex]);
                break;
        }
    });
}

/* ================================
   SCROLL SNAP FUNCTIONALITY
   ================================ */
function initScrollSnap() {
    let isScrolling = false;
    let scrollTimer = null;
    
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        isScrolling = true;
        
        scrollTimer = setTimeout(function() {
            isScrolling = false;
            snapToNearestSection();
        }, 150);
    });
    
    function snapToNearestSection() {
        if (isScrolling) return;
        
        const sections = document.querySelectorAll('.page-section, section[id]');
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        
        let nearestSection = null;
        let nearestDistance = Infinity;
        
        sections.forEach(section => {
            const sectionTop = getElementOffsetTop(section) - headerHeight;
            const sectionCenter = sectionTop + (section.offsetHeight / 2);
            const viewportCenter = scrollPosition + (windowHeight / 2);
            const distance = Math.abs(sectionCenter - viewportCenter);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestSection = section;
            }
        });
        
        if (nearestSection && nearestDistance > 100) {
            const targetPosition = getElementOffsetTop(nearestSection) - headerHeight;
            smoothScrollTo(targetPosition, 400);
        }
    }
}

/* ================================
   MOBILE SCROLL OPTIMIZATION
   ================================ */
function initMobileScrollOptimization() {
    let ticking = false;
    
    function updateScrollElements() {
        // Update any scroll-dependent elements here
        const scrollTop = window.pageYOffset;
        
        // Update scroll-to-top button
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (scrollToTopBtn) {
            if (scrollTop > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        // Update header background
        const header = document.querySelector('.header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/* ================================
   INITIALIZE ALL SCROLL FEATURES
   ================================ */
function initAllScrollFeatures() {
    initSmoothScrolling();
    initScrollToTop();
    initActiveNavigation();
    initScrollAnimations();
    initHashChangeHandling();
    initKeyboardNavigation();
    initMobileScrollOptimization();
    
    // Optional features (uncomment to enable)
    // initParallaxEffects();
    // initScrollProgressIndicator();
    // initScrollSnap();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllScrollFeatures);
} else {
    initAllScrollFeatures();
}

/* ================================
   SMOOTH SCROLL CSS ADDITIONS
   ================================ */
const smoothScrollStyles = `
    <style>
    /* Scroll to top button styles */
    .scroll-to-top.visible {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
    }
    
    .scroll-to-top:hover {
        background: var(--accent-color, #f39c12) !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* Active navigation styles */
    .nav-item.active {
        color: var(--accent-color, #f39c12) !important;
        position: relative;
    }
    
    .nav-item.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: var(--accent-color, #f39c12);
        border-radius: 1px;
    }
    
    /* Scroll animation styles */
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        animation: slideInUp 0.6s ease-out;
    }
    
    /* Initial state for animated elements */
    .service-box,
    .portfolio-item,
    .package,
    .blog-item,
    .work-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    /* Scroll progress bar */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, var(--primary-color, #2c3e50), var(--accent-color, #f39c12));
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.1s ease;
        z-index: 10001;
        width: 100%;
    }
    
    /* Smooth scrolling for all browsers */
    html {
        scroll-behavior: smooth;
    }
    
    /* Disable smooth scrolling during animations */
    html.no-smooth-scroll {
        scroll-behavior: auto;
    }
    
    /* Parallax container */
    .parallax-container {
        overflow-x: hidden;
    }
    
    /* Mobile scroll optimization */
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px !important;
            right: 20px !important;
            width: 45px !important;
            height: 45px !important;
            font-size: 18px !important;
        }
        
        /* Disable parallax on mobile for performance */
        .hero,
        .testimonials {
            transform: none !important;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .scroll-to-top {
            border: 2px solid currentColor;
        }
        
        .nav-item.active::after {
            height: 3px;
        }
    }
    
    /* Focus styles for accessibility */
    .scroll-to-top:focus {
        outline: 2px solid var(--accent-color, #f39c12);
        outline-offset: 2px;
    }
    
    .nav-item:focus {
        outline: 2px solid var(--accent-color, #f39c12);
        outline-offset: 2px;
        border-radius: 4px;
    }
    </style>
`;

// Insert smooth scroll styles
document.head.insertAdjacentHTML('beforeend', smoothScrollStyles);