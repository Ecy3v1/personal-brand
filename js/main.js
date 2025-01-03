/* ==========================================================================
   Main Application
   ========================================================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initLoading();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize language switcher
    initLanguage();
});

// Loading screen
function initLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            loadingScreen.classList.add('loading-screen--hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        });
    }
}

// Mobile menu
function initMobileMenu() {
    const mobileToggle = document.querySelector('.navbar__mobile-toggle');
    const navMenu = document.querySelector('.navbar__menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Initialize animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate work cards on scroll
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // Animate about section
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        gsap.from(aboutContent, {
            scrollTrigger: {
                trigger: aboutContent,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }
}

// Language switcher
function initLanguage() {
    const langToggle = document.querySelector('.navbar__lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'en' ? 'zh' : 'en';
            document.documentElement.lang = newLang;
            updateLanguage(newLang);
        });
    }
} 
