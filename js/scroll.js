// Scroll Control
class ScrollController {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.currentSection = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        // Prevent default scrolling
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!this.isScrolling) {
                this.handleScroll(e.deltaY);
            }
        }, { passive: false });
        
        // Touch events for mobile
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
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
        
        // Update active section on page load
        this.updateActiveSection();
    }
    
    handleScroll(delta) {
        if (Math.abs(delta) < 30) return; // Threshold for scroll sensitivity
        
        this.isScrolling = true;
        
        if (delta > 0 && this.currentSection < this.sections.length - 1) {
            // Scroll down
            this.currentSection++;
            this.scrollToSection(this.sections[this.currentSection].id);
        } else if (delta < 0 && this.currentSection > 0) {
            // Scroll up
            this.currentSection--;
            this.scrollToSection(this.sections[this.currentSection].id);
        }
        
        // Reset scroll lock after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Update current section index
        this.currentSection = Array.from(this.sections).findIndex(s => s.id === sectionId);
        
        // Smooth scroll to section
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Update active navigation link
        this.updateActiveSection();
        
        // Trigger section enter animations
        this.triggerSectionAnimations(section);
    }
    
    updateActiveSection() {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === this.sections[this.currentSection].id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    triggerSectionAnimations(section) {
        // Reset previous section animations
        this.sections.forEach(s => {
            if (s !== section) {
                s.querySelectorAll('.animate-on-enter').forEach(el => {
                    el.classList.remove('animated');
                });
            }
        });
        
        // Trigger animations for current section
        section.querySelectorAll('.animate-on-enter').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 100); // Stagger animations
        });
    }
}

// Initialize scroll controller
document.addEventListener('DOMContentLoaded', () => {
    new ScrollController();
});