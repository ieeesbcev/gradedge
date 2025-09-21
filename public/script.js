// DOM Elements - Removed hamburger and navMenu since mobile nav is removed

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
}

// Navigation functionality
function setupNavigation() {
    // Mobile navigation removed as requested - no hamburger menu needed
    
    // Smooth scrolling for anchor links with mobile optimization
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const extraOffset = window.innerWidth <= 768 ? 10 : 20;
                const targetPosition = targetElement.offsetTop - headerHeight - extraOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll with improved performance
    const header = document.querySelector('.header');
    if (header) {
        let isScrolling = false;
        
        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    if (scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// Scroll effects
function setupScrollEffects() {
    // Intersection Observer for animations with better handling
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.classList.remove('fade-out-down');
            } else {
                // Only fade out if the element has scrolled completely out of view
                if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                    entry.target.classList.remove('fade-in-up');
                    entry.target.classList.add('fade-out-down');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation and set initial state
    const animatedElements = document.querySelectorAll('.about-card, .timeline-item, .pricing-card, .organizer-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll'); // Add initial hidden state
        observer.observe(el);
    });
    
    // Optimized parallax effect for hero background
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const matrixEffect = document.querySelector('.matrix-effect');
        
        if (hero && matrixEffect && scrolled < hero.offsetHeight * 1.5) {
            const speed = scrolled * 0.3; // Reduced speed for smoother effect
            matrixEffect.style.transform = `translate3d(0, ${speed}px, 0)`; // Use translate3d for hardware acceleration
        }
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// Setup animations
function setupAnimations() {
    // Add stagger animation to cards with better timing
    const cardContainers = document.querySelectorAll('.about-grid, .pricing-grid, .organizers-grid');
    
    cardContainers.forEach(container => {
        const cards = container.children;
        Array.from(cards).forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.08}s`; // Reduced delay for smoother stagger
        });
    });
    
    // Optimize typing effect for hero subtitle
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && window.innerWidth > 768) { // Only on desktop
        const text = heroDescription.textContent;
        heroDescription.textContent = '';
        heroDescription.style.borderRight = '2px solid var(--primary-green)';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroDescription.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30); // Faster typing speed
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroDescription.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing effect after a shorter delay
        setTimeout(typeWriter, 500);
    }
}

// Utility functions
function debounce(func, wait) {
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
    }
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle resize events
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && window.innerWidth <= 768) {
        // Reset typing effect on mobile
        heroDescription.style.borderRight = 'none';
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can add error reporting here
});