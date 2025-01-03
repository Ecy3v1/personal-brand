/* ==========================================================================
   Layout Manager
   ========================================================================== */

class LayoutManager {
    constructor() {
        this.viewportHeight = window.innerHeight;
        this.viewportWidth = window.innerWidth;
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.isMobile = window.innerWidth < 768;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLayout();
    }

    setupEventListeners() {
        // Throttled resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            this.isScrolling = true;
            
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                this.isScrolling = false;
            }, 100);
        });
    }

    handleResize() {
        this.viewportHeight = window.innerHeight;
        this.viewportWidth = window.innerWidth;
        this.isMobile = window.innerWidth < 768;
        
        this.updateLayout();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('layoutUpdate', {
            detail: {
                viewportHeight: this.viewportHeight,
                viewportWidth: this.viewportWidth,
                isMobile: this.isMobile
            }
        }));
    }

    handleScroll() {
        this.scrollPosition = window.scrollY;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('scrollUpdate', {
            detail: {
                scrollPosition: this.scrollPosition,
                direction: this.getScrollDirection()
            }
        }));
    }

    getScrollDirection() {
        const currentScroll = this.scrollPosition;
        const direction = currentScroll > this.lastScroll ? 'down' : 'up';
        this.lastScroll = currentScroll;
        return direction;
    }

    updateLayout() {
        // Update CSS custom properties
        document.documentElement.style.setProperty('--vh', `${this.viewportHeight}px`);
        document.documentElement.style.setProperty('--vw', `${this.viewportWidth}px`);
        
        // Update body classes
        document.body.classList.toggle('is-mobile', this.isMobile);
    }

    // Utility methods
    getBreakpoint() {
        if (this.viewportWidth < 480) return 'xs';
        if (this.viewportWidth < 768) return 'sm';
        if (this.viewportWidth < 1024) return 'md';
        if (this.viewportWidth < 1280) return 'lg';
        return 'xl';
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= this.viewportHeight &&
            rect.right <= this.viewportWidth
        );
    }

    getScrollProgress() {
        const docHeight = document.documentElement.scrollHeight;
        const scrolled = (this.scrollPosition / (docHeight - this.viewportHeight)) * 100;
        return Math.min(Math.max(scrolled, 0), 100);
    }
}

export default LayoutManager; 