/* ==========================================================================
   Decorative Elements Controller
   ========================================================================== */

class DecorativeController {
    constructor() {
        this.decorativeElements = [];
        this.init();
    }

    init() {
        this.createRandomElements();
        this.initializeAnimations();
        this.addEventListeners();
    }

    createRandomElements() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            // Create random number of elements for each section
            const count = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < count; i++) {
                this.createDecorativeElement(section);
            }
        });
    }

    createDecorativeElement(container) {
        const element = document.createElement('div');
        element.className = 'decorative-element';
        
        // Random position
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 50 + 20;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Random rotation
        element.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random shape
        const shapes = ['circle', 'square', 'triangle', 'squiggle'];
        element.classList.add(`shape-${shapes[Math.floor(Math.random() * shapes.length)]}`);
        
        container.appendChild(element);
        this.decorativeElements.push(element);
        
        // Initialize GSAP animation
        this.animateElement(element);
    }

    animateElement(element) {
        gsap.to(element, {
            rotation: `+=${Math.random() * 360}`,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            duration: Math.random() * 10 + 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }

    initializeAnimations() {
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            this.decorativeElements.forEach(element => {
                const speed = Math.random() * 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    addEventListeners() {
        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            this.decorativeElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const elementY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - elementX;
                const deltaY = mouseY - elementY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 200) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const push = (200 - distance) / 10;
                    
                    gsap.to(element, {
                        x: `-=${Math.cos(angle) * push}`,
                        y: `-=${Math.sin(angle) * push}`,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DecorativeController();
}); 