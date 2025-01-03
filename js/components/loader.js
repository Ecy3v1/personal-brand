/* ==========================================================================
   Loading Controller
   ========================================================================== */

class LoadingController {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.loaderText = document.querySelector('.loader-text');
        this.loaderProgress = document.querySelector('.loader-progress');
        this.appContainer = document.querySelector('.app-container');
        this.progress = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        document.body.classList.add('is-loading');
        this.simulateLoading();
        this.preloadImages();
    }
    
    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 10;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.finishLoading();
            }
            
            this.updateProgress();
        }, 150);
    }
    
    async preloadImages() {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve); // Resolve on error to continue loading
                }
            });
        });
        
        await Promise.all(imagePromises);
        this.isLoaded = true;
    }
    
    updateProgress() {
        if (this.loaderText) {
            this.loaderText.textContent = `${Math.round(this.progress)}%`;
        }
        
        if (this.loaderProgress) {
            this.loaderProgress.style.transform = `scaleX(${this.progress / 100})`;
        }
    }
    
    finishLoading() {
        const checkLoaded = setInterval(() => {
            if (this.isLoaded) {
                clearInterval(checkLoaded);
                document.body.classList.remove('is-loading');
                document.body.classList.add('is-loaded');
                
                setTimeout(() => {
                    document.body.classList.add('is-ready');
                    this.initializeAnimations();
                }, 800);
            }
        }, 100);
    }
    
    initializeAnimations() {
        // Add animation classes to elements
        document.querySelectorAll('.animate-on-enter').forEach((element, index) => {
            element.classList.add('fade-up');
            element.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Initialize scroll-based animations
        this.initScrollAnimations();
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

// Initialize loading controller
document.addEventListener('DOMContentLoaded', () => {
    new LoadingController();
}); 
