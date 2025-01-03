/* ==========================================================================
   Scroll Controller
   ========================================================================== */

class ScrollController {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        // Prevent default scrolling
        document.body.style.overflow = 'hidden';
        
        // Handle wheel events
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!this.isScrolling) {
                this.handleScroll(e.deltaY);
            }
        }, { passive: false });
        
        // Handle touch events
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.touchEndY = e.touches[0].clientY;
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (!this.isScrolling) {
                const delta = this.touchStartY - this.touchEndY;
                this.handleScroll(delta);
            }
        }, { passive: true });
        
        // Handle navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
        
        // Set initial section based on URL hash
        this.setInitialSection();
        
        // Initialize scroll-based animations
        this.initScrollAnimations();
    }
    
    handleScroll(delta) {
        if (Math.abs(delta) < 30) return;
        
        this.isScrolling = true;
        
        if (delta > 0 && this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.scrollToSection(this.sections[this.currentSection].id);
        } else if (delta < 0 && this.currentSection > 0) {
            this.currentSection--;
            this.scrollToSection(this.sections[this.currentSection].id);
        }
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        this.currentSection = Array.from(this.sections).findIndex(s => s.id === sectionId);
        
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL hash without scrolling
        window.history.replaceState(null, '', `#${sectionId}`);
        
        // Update active states
        this.updateActiveStates();
    }
    
    setInitialSection() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                this.currentSection = Array.from(this.sections).indexOf(targetSection);
                this.scrollToSection(hash);
            }
        }
        
        this.updateActiveStates();
    }
    
    updateActiveStates() {
        this.navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === this.sections[this.currentSection].id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize scroll controller
document.addEventListener('DOMContentLoaded', () => {
    new ScrollController();
}); 
