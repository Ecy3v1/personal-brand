/* ==========================================================================
   Transition Controller
   ========================================================================== */

class TransitionController {
    constructor() {
        this.pageTransition = document.createElement('div');
        this.pageTransition.className = 'page-transition';
        document.body.appendChild(this.pageTransition);
        
        this.init();
    }
    
    init() {
        // Initialize observers
        this.initSectionObserver();
        this.initContentObserver();
        
        // Handle navigation transitions
        this.handleNavigationTransitions();
    }
    
    initSectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('section-transition')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        // Observe sections
        document.querySelectorAll('.section-transition').forEach(section => {
            observer.observe(section);
        });
    }
    
    initContentObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe reveal elements
        document.querySelectorAll('.reveal-text, .reveal-image').forEach(element => {
            observer.observe(element);
        });
    }
    
    handleNavigationTransitions() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Trigger page transition
                this.pageTransition.classList.add('active');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.hash = href;
                    this.pageTransition.classList.remove('active');
                }, 600);
            });
        });
    }
    
    // Public methods for triggering transitions
    triggerPageTransition() {
        return new Promise(resolve => {
            this.pageTransition.classList.add('active');
            setTimeout(() => {
                this.pageTransition.classList.remove('active');
                resolve();
            }, 1200);
        });
    }
    
    revealContent(element) {
        if (element.classList.contains('reveal-text') || element.classList.contains('reveal-image')) {
            element.classList.add('visible');
        }
    }
    
    revealSection(section) {
        if (section.classList.contains('section-transition')) {
            section.classList.add('visible');
        }
    }
}

// Initialize transition controller
document.addEventListener('DOMContentLoaded', () => {
    window.transitionController = new TransitionController();
}); 