/* ==========================================================================
   Page Transitions
   ========================================================================== */

class PageTransitions {
    constructor() {
        this.sections = gsap.utils.toArray('.section');
        this.currentSection = 0;
        this.isAnimating = false;
        this.overlay = document.querySelector('.transition-overlay');
        this.progressDots = document.querySelectorAll('.scroll-progress__dot');
        
        this.init();
    }

    init() {
        // Set up initial state
        gsap.set(this.sections, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh'
        });

        gsap.set(this.sections.slice(1), { y: '100%' });
        this.updateProgress();

        // Add event listeners
        this.addScrollListener();
        this.addProgressClickListener();
        this.addKeyboardListener();
    }

    addScrollListener() {
        window.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;

            if (e.deltaY > 0) {
                this.navigateToSection(this.currentSection + 1);
            } else {
                this.navigateToSection(this.currentSection - 1);
            }
        });
    }

    addProgressClickListener() {
        this.progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.isAnimating) return;
                this.navigateToSection(index);
            });
        });
    }

    addKeyboardListener() {
        window.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;

            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                this.navigateToSection(this.currentSection + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                this.navigateToSection(this.currentSection - 1);
            }
        });
    }

    navigateToSection(index) {
        // Validate index
        if (index < 0 || index >= this.sections.length || index === this.currentSection) return;

        this.isAnimating = true;
        const direction = index > this.currentSection ? 1 : -1;
        const currentSection = this.sections[this.currentSection];
        const targetSection = this.sections[index];

        // Timeline for the transition
        const tl = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                this.currentSection = index;
                this.updateProgress();
            }
        });

        // Overlay animation
        tl.to(this.overlay, {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        })
        .set(targetSection, { y: `${direction * 100}%` })
        .to(currentSection, {
            y: `${-direction * 100}%`,
            duration: 0.5,
            ease: 'power2.inOut'
        }, '<')
        .to(targetSection, {
            y: '0%',
            duration: 0.5,
            ease: 'power2.inOut'
        }, '<')
        .to(this.overlay, {
            scaleY: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        });
    }

    updateProgress() {
        this.progressDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
}); 