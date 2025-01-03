/* ==========================================================================
   State Manager
   ========================================================================== */

class StateManager {
    constructor() {
        this.state = {
            isLoading: true,
            currentSection: null,
            activeCategory: 'all',
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            menuOpen: false
        };
        
        this.subscribers = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkInitialState();
    }

    setupEventListeners() {
        // Listen for dark mode changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                this.setState('isDarkMode', e.matches);
            });
            
        // Handle history changes
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    checkInitialState() {
        // Check URL for initial section
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.setState('currentSection', hash);
        }
        
        // Initialize loading state
        window.addEventListener('load', () => {
            this.setState('isLoading', false);
        });
    }

    // State management
    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        // Notify subscribers
        if (oldValue !== value) {
            this.notifySubscribers(key, value, oldValue);
        }
    }

    getState(key) {
        return this.state[key];
    }

    // Subscription system
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.get(key).delete(callback);
        };
    }

    notifySubscribers(key, newValue, oldValue) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => {
                callback(newValue, oldValue);
            });
        }
    }

    // Route handling
    handleRouteChange() {
        const hash = window.location.hash.slice(1);
        this.setState('currentSection', hash || 'home');
    }

    // State transitions
    async transition(from, to) {
        // Set loading state
        this.setState('isLoading', true);
        
        try {
            // Trigger exit animations
            await this.triggerTransition('exit', from);
            
            // Update state
            this.setState('currentSection', to);
            
            // Update URL
            window.history.pushState(null, '', `#${to}`);
            
            // Trigger enter animations
            await this.triggerTransition('enter', to);
        } finally {
            // Reset loading state
            this.setState('isLoading', false);
        }
    }

    async triggerTransition(type, section) {
        return new Promise(resolve => {
            // Dispatch transition event
            window.dispatchEvent(new CustomEvent('stateTransition', {
                detail: { type, section }
            }));
            
            // Add small delay for animations
            setTimeout(resolve, 500);
        });
    }
}

export default StateManager; 