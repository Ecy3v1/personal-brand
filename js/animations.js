/* ==========================================================================
   Animation Controller
   ========================================================================== */

class AnimationController {
    constructor() {
        this.initializeGSAP();
        this.handleLoading();
        this.setupWorkCardAnimations();
        this.setupScrollProgress();
        this.setupAboutAnimation();
        this.setupSectionTransitions();
        this.setupCategoryFilter();
    }

    initializeGSAP() {
        gsap.registerPlugin(ScrollTrigger);
        gsap.config({
            nullTargetWarn: false
        });
    }

    handleLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            // Hide loading screen after content is loaded
            window.addEventListener('load', () => {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.5,
                    onComplete: () => {
                        loadingScreen.classList.add('hidden');
                        this.playEntryAnimations();
                    }
                });
            });
        }
    }

    playEntryAnimations() {
        // Animate work cards entry
        gsap.from('.work-card', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });

        // Animate about section entry
        gsap.from('.about-content', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out'
        });
    }

    setupWorkCardAnimations() {
        const workCards = document.querySelectorAll('.minimal-card');
        
        workCards.forEach((card, index) => {
            const content = card.querySelector('.work-card__content');
            const image = card.querySelector('img');
            
            // Initial state
            gsap.set(card, { opacity: 0, y: 50 });
            
            // Entrance animation
            ScrollTrigger.create({
                trigger: card,
                start: 'top bottom-=100',
                end: 'bottom top+=100',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: index * 0.2,
                        ease: 'power3.out'
                    });
                }
            });
            
            // Hover animations
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                if (content) {
                    gsap.to(content, {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        delay: 0.2,
                        ease: 'power2.out'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
                
                if (content) {
                    gsap.to(content, {
                        y: 20,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            });
        });
    }

    setupScrollProgress() {
        const sections = document.querySelectorAll('.section');
        const dots = document.querySelectorAll('.scroll-progress__dot');

        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => this.updateScrollProgress(dots, index),
                onEnterBack: () => this.updateScrollProgress(dots, index)
            });
        });
    }

    setupAboutAnimation() {
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
            ScrollTrigger.create({
                trigger: aboutSection,
                start: 'top center+=100',
                onEnter: () => {
                    gsap.from('.about-title', {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    });

                    gsap.from('.about-text', {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power2.out'
                    });

                    gsap.from('.about-cta', {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.4,
                        ease: 'power2.out'
                    });
                },
                once: true
            });
        }
    }

    setupSectionTransitions() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            // Create texture overlay for each section
            const textureOverlay = document.createElement('div');
            textureOverlay.className = 'section-texture';
            section.appendChild(textureOverlay);
            
            // Set up scroll trigger for section entrance
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom-=100',
                end: 'bottom top+=100',
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
                    
                    gsap.to(textureOverlay, {
                        opacity: 0.05,
                        duration: 1.2,
                        ease: 'power2.inOut'
                    });
                },
                onLeave: () => {
                    gsap.to(section, {
                        opacity: 0,
                        y: -50,
                        duration: 0.8,
                        ease: 'power3.in'
                    });
                },
                onEnterBack: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(section, {
                        opacity: 0,
                        y: 50,
                        duration: 0.8,
                        ease: 'power3.in'
                    });
                }
            });
        });
    }

    updateScrollProgress(dots, activeIndex) {
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    setupCategoryFilter() {
        const categoryItems = document.querySelectorAll('.category-nav__item');
        const workCards = document.querySelectorAll('.minimal-card');
        
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                categoryItems.forEach(cat => cat.classList.remove('active'));
                item.classList.add('active');
                
                const category = item.dataset.category;
                
                // Filter cards
                workCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    
                    if (category === 'all' || cardCategory === category) {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                            clearProps: 'transform'
                        });
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            y: 20,
                            duration: 0.4,
                            ease: 'power2.in'
                        });
                    }
                });
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
}); 