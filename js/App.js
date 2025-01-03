/* ==========================================================================
   Main Application
   ========================================================================== */

import LayoutManager from './core/LayoutManager.js';
import StateManager from './core/StateManager.js';
import AnimationController from './animations.js';

class App {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize core managers
        this.layoutManager = new LayoutManager();
        this.stateManager = new StateManager();
        this.animationController = new AnimationController();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize components
        await this.initializeComponents();

        // Start the application
        this.start();
    }

    setupEventListeners() {
        // Listen for state changes
        this.stateManager.subscribe('currentSection', (newSection) => {
            this.handleSectionChange(newSection);
        });

        this.stateManager.subscribe('isDarkMode', (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
        });

        // Listen for layout changes
        window.addEventListener('layoutUpdate', (e) => {
            this.handleLayoutUpdate(e.detail);
        });
    }

    async initializeComponents() {
        // Initialize navigation
        const navLinks = document.querySelectorAll('.navbar__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').slice(1);
                this.stateManager.transition(
                    this.stateManager.getState('currentSection'),
                    section
                );
            });
        });

        // Initialize work grid
        const categoryItems = document.querySelectorAll('.category-nav__item');
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.stateManager.setState('activeCategory', category);
            });
        });
    }

    handleSectionChange(newSection) {
        // Update active navigation
        document.querySelectorAll('.navbar__link').forEach(link => {
            const section = link.getAttribute('href').slice(1);
            link.classList.toggle('active', section === newSection);
        });

        // Scroll to section
        const sectionElement = document.getElementById(newSection);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleLayoutUpdate({ viewportHeight, viewportWidth, isMobile }) {
        // Update layout-dependent animations
        this.animationController.updateAnimations({
            viewportHeight,
            viewportWidth,
            isMobile
        });
    }

    start() {
        // Remove loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('loading-screen--hidden');
        }

        // Initialize first section
        const initialSection = this.stateManager.getState('currentSection') || 'work';
        this.handleSectionChange(initialSection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 