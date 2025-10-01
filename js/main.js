/* ================================
   PHOTOGRAPHY STUDIO - MAIN JS
   ================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    initMobileMenu();
    initTestimonialCarousel();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initImageLazyLoading();
    console.log('Photography Studio app initialized successfully!');
}

/* ================================
   MOBILE MENU FUNCTIONALITY
   ================================ */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!mobileToggle || !navMenu) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
}

/* ================================
   TESTIMONIAL CAROUSEL
   ================================ */
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    let isPlaying = true;
    
    if (testimonials.length === 0) return;
    
    // Show specific slide
    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });
        
        // Show current testimonial
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = currentSlide === 0 ? testimonials.length - 1 : currentSlide - 1;
        showSlide(currentSlide);
    }
    
    // Start auto-rotation
    function startAutoRotation() {
        if (isPlaying) {
            slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
        }
    }
    
    // Stop auto-rotation
    function stopAutoRotation() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoRotation();
            showSlide(index);
            startAutoRotation();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel || !isElementInViewport(carousel)) return;
        
        if (e.key === 'ArrowLeft') {
            stopAutoRotation();
            prevSlide();
            startAutoRotation();
        } else if (e.key === 'ArrowRight') {
            stopAutoRotation();
            nextSlide();
            startAutoRotation();
        }
    });
    
    // Pause/play on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            stopAutoRotation();
            this.classList.add('paused');
        });
        
        carousel.addEventListener('mouseleave', function() {
            startAutoRotation();
            this.classList.remove('paused');
        });
        
        // Pause/play on focus (accessibility)
        carousel.addEventListener('focusin', stopAutoRotation);
        carousel.addEventListener('focusout', startAutoRotation);
    }
    
    // Initialize carousel
    showSlide(0);
    startAutoRotation();
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isPlaying = false;
            stopAutoRotation();
        } else {
            isPlaying = true;
            startAutoRotation();
        }
    });
}

// Global function for dot navigation (called from HTML)
function currentSlide(index) {
    const event = new CustomEvent('slideChange', { detail: { index: index - 1 } });
    document.dispatchEvent(event);
}

// Listen for slide change events
document.addEventListener('slideChange', function(e) {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });
    
    if (testimonials[e.detail.index]) {
        testimonials[e.detail.index].classList.add('active');
        if (dots[e.detail.index]) dots[e.detail.index].classList.add('active');
    }
});

/* ================================
   FAQ FUNCTIONALITY
   ================================ */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQItem(this);
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQItem(this);
            }
        });
        
        // Make focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
    
    function toggleFAQItem(questionElement) {
        const faqItem = questionElement.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = questionElement.querySelector('.faq-icon');
        const isActive = questionElement.classList.contains('active');
        
        // Close all other FAQs
        faqQuestions.forEach(otherQuestion => {
            if (otherQuestion !== questionElement) {
                const otherFaqItem = otherQuestion.parentElement;
                const otherAnswer = otherFaqItem.querySelector('.faq-answer');
                const otherIcon = otherQuestion.querySelector('.faq-icon');
                
                otherQuestion.classList.remove('active');
                otherQuestion.setAttribute('aria-expanded', 'false');
                if (otherAnswer) otherAnswer.classList.remove('active');
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Toggle current FAQ
        if (isActive) {
            questionElement.classList.remove('active');
            questionElement.setAttribute('aria-expanded', 'false');
            if (answer) answer.classList.remove('active');
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            questionElement.classList.add('active');
            questionElement.setAttribute('aria-expanded', 'true');
            if (answer) answer.classList.add('active');
            if (icon) icon.style.transform = 'rotate(45deg)';
        }
    }
}

// Global function for FAQ toggle (called from HTML)
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    // Close all other FAQs first
    const allQuestions = document.querySelectorAll('.faq-question');
    allQuestions.forEach(question => {
        if (question !== element) {
            const otherFaqItem = question.parentElement;
            const otherAnswer = otherFaqItem.querySelector('.faq-answer');
            const otherIcon = question.querySelector('.faq-icon');
            
            question.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.classList.remove('active');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    const isActive = element.classList.contains('active');
    
    if (isActive) {
        element.classList.remove('active');
        element.setAttribute('aria-expanded', 'false');
        if (answer) answer.classList.remove('active');
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        element.classList.add('active');
        element.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('active');
        if (icon) icon.style.transform = 'rotate(45deg)';
    }
}

/* ================================
   CONTACT FORM FUNCTIONALITY
   ================================ */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObj = {};
        
        formData.forEach((value, key) => {
            formObj[key] = value;
        });
        
        // Validate form
        if (validateContactForm(formObj)) {
            submitForm(formObj);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Character count for message
    const messageField = contactForm.querySelector('#message');
    if (messageField) {
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.style.cssText = 'font-size: 0.9rem; color: #666; text-align: right; margin-top: 5px;';
        messageField.parentNode.appendChild(charCount);
        
        messageField.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count}/500 characters`;
            
            if (count > 500) {
                charCount.style.color = '#e74c3c';
            } else {
                charCount.style.color = '#666';
            }
        });
    }
}

function submitForm(formData) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success response
        showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
        document.getElementById('contactForm').reset();
        
        // Clear character count
        const charCount = document.querySelector('.char-count');
        if (charCount) charCount.textContent = '0/500 characters';
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Track form submission (if analytics is set up)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'contact',
                'event_label': 'contact_form'
            });
        }
    }, 2000);
}

function validateContactForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    } else if (data.name.trim().length > 50) {
        showFieldError('name', 'Name must be less than 50 characters');
        isValid = false;
    }
    
    // Email validation
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!data.email || !emailPattern.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional but if provided should be valid)
    if (data.phone && data.phone.trim().length > 0) {
        const phonePattern = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
        const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
        if (cleanPhone.length < 7 || cleanPhone.length > 15 || !phonePattern.test(data.phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    } else if (data.message.trim().length > 500) {
        showFieldError('message', 'Message must be less than 500 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (value.length > 0 && value.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
                return false;
            } else if (value.length > 50) {
                showFieldError('name', 'Name must be less than 50 characters');
                return false;
            }
            break;
            
        case 'email':
            if (value.length > 0) {
                const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailPattern.test(value)) {
                    showFieldError('email', 'Please enter a valid email address');
                    return false;
                }
            }
            break;
            
        case 'phone':
            if (value.length > 0) {
                const phonePattern = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
                const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                if (cleanPhone.length < 7 || cleanPhone.length > 15 || !phonePattern.test(value)) {
                    showFieldError('phone', 'Please enter a valid phone number');
                    return false;
                }
            }
            break;
            
        case 'message':
            if (value.length > 0 && value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
                return false;
            } else if (value.length > 500) {
                showFieldError('message', 'Message must be less than 500 characters');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class and message
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.9rem; margin-top: 5px;';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    formGroup.appendChild(errorElement);
    
    // Focus the field with error
    field.focus();
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.setAttribute('role', 'alert');
    messageElement.style.cssText = `
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        animation: slideInUp 0.3s ease-out;
        ${type === 'success' ? 
            'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
            'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    messageElement.textContent = message;
    
    // Insert message
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageElement, contactForm);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
    }
}

/* ================================
   SCROLL ANIMATIONS
   ================================ */
function initScrollAnimations() {
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .service-box,
        .portfolio-item,
        .package,
        .blog-item,
        .work-item,
        .testimonial-item
    `);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/* ================================
   HEADER SCROLL EFFECT
   ================================ */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction (only on mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/* ================================
   IMAGE LAZY LOADING
   ================================ */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src], [data-bg]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                    }
                    
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.classList.add('lazy-loaded');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.bg) {
                img.style.backgroundImage = `url(${img.dataset.bg})`;
            }
        });
    }
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Throttle function for performance
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

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
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

// Get element's position relative to document
function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

// Format phone number for display
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

/* ================================
   ERROR HANDLING & LOGGING
   ================================ */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

/* ================================
   ADDITIONAL CSS FOR MAIN.JS FEATURES
   ================================ */
const mainStyles = `
    <style>
    /* Form error states */
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        background-color: #fdf2f2;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
    }
    
    /* Header scroll effects */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header {
        transition: all 0.3s ease;
    }
    
    /* Mobile menu open state */
    body.menu-open {
        overflow: hidden;
    }
    
    /* Loading button state */
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    /* Testimonial carousel paused state */
    .testimonial-carousel.paused::after {
        content: '⏸️';
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        opacity: 0.7;
    }
    
    /* Character count styling */
    .char-count {
        font-size: 0.9rem;
        color: #666;
        text-align: right;
        margin-top: 5px;
        transition: color 0.3s ease;
    }
    
    /* Lazy loading images */
    img.lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.lazy-loaded {
        opacity: 1;
    }
    
    /* Animations */
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-up {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    /* Focus styles for accessibility */
    .faq-question:focus {
        outline: 2px solid #f39c12;
        outline-offset: 2px;
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
        .form-message {
            margin: 15px 0;
            padding: 12px 15px;
            font-size: 0.9rem;
        }
        
        .char-count {
            font-size: 0.8rem;
        }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-width: 3px;
        }
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .animate-up {
            animation: none;
        }
        
        .testimonial-item {
            transition: none;
        }
        
        .header {
            transition: none;
        }
    }
    </style>
`;

// Insert main styles
document.head.insertAdjacentHTML('beforeend', mainStyles);