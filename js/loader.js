// Loading State Management
const LOADER_SETTINGS = {
    minLoadTime: 800,
    fadeOutDuration: 500,
    loadingClass: 'is-loading',
    loadedClass: 'is-loaded',
    readyClass: 'is-ready'
};

// Initialize loading state
document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
});

function initializeLoader() {
    const loader = document.querySelector('.loader');
    const appContainer = document.querySelector('.app-container');
    
    if (!loader || !appContainer) return;
    
    // Add loading class to body
    document.body.classList.add(LOADER_SETTINGS.loadingClass);
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Track loading start time
    const loadStartTime = performance.now();
    
    // Initialize loading progress
    let loadProgress = 0;
    updateLoaderProgress(loadProgress);
    
    // Handle resource loading
    Promise.all([
        loadImages(),
        loadFonts(),
        loadScripts(),
        new Promise(resolve => setTimeout(resolve, LOADER_SETTINGS.minLoadTime))
    ]).then(() => {
        fadeOutLoader(loader, appContainer);
    }).catch(error => {
        console.error('Loading error:', error);
        fadeOutLoader(loader, appContainer);
    });
    
    // Update progress periodically
    const progressInterval = setInterval(() => {
        if (loadProgress < 90) {
            loadProgress += (90 - loadProgress) * 0.1;
            updateLoaderProgress(loadProgress);
        }
    }, 100);
    
    // Clean up interval when loading is complete
    window.addEventListener('load', () => {
        clearInterval(progressInterval);
        loadProgress = 100;
        updateLoaderProgress(loadProgress);
    });
}

// Handle image loading
function loadImages() {
    const images = Array.from(document.images);
    const imagePromises = images.map(img => {
        if (img.complete) {
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', () => {
                    console.warn(`Failed to load image: ${img.src}`);
                    resolve(); // Don't reject to allow loading to continue
                });
            });
        }
    });
    
    return Promise.all(imagePromises);
}

// Handle font loading
function loadFonts() {
    if ('fonts' in document) {
        return document.fonts.ready;
    }
    return Promise.resolve();
}

// Handle script loading
function loadScripts() {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const scriptPromises = scripts
        .filter(script => !script.async && !script.defer)
        .map(script => {
            if (script.hasAttribute('src')) {
                return new Promise((resolve, reject) => {
                    script.addEventListener('load', resolve);
                    script.addEventListener('error', () => {
                        console.warn(`Failed to load script: ${script.src}`);
                        resolve(); // Don't reject to allow loading to continue
                    });
                });
            }
            return Promise.resolve();
        });
    
    return Promise.all(scriptPromises);
}

// Update loader progress
function updateLoaderProgress(progress) {
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderText = document.querySelector('.loader-text');
    
    if (loaderProgress) {
        loaderProgress.style.transform = `scaleX(${progress / 100})`;
    }
    
    if (loaderText) {
        loaderText.textContent = `${Math.round(progress)}%`;
    }
}

// Fade out loader
function fadeOutLoader(loader, appContainer) {
    // Remove loading class and add loaded class
    document.body.classList.remove(LOADER_SETTINGS.loadingClass);
    document.body.classList.add(LOADER_SETTINGS.loadedClass);
    
    // Fade out loader
    loader.style.opacity = '0';
    loader.style.transition = `opacity ${LOADER_SETTINGS.fadeOutDuration}ms var(--transition-smooth)`;
    
    // Show app container
    appContainer.style.opacity = '1';
    appContainer.style.transform = 'none';
    
    // Re-enable scrolling after fade out
    setTimeout(() => {
        document.body.style.overflow = '';
        loader.style.display = 'none';
        document.body.classList.add(LOADER_SETTINGS.readyClass);
        
        // Initialize scroll-based animations after loading
        if (typeof initializeScrollReveal === 'function') {
            initializeScrollReveal();
        }
        
        // Dispatch custom event when loading is complete
        window.dispatchEvent(new CustomEvent('app-loaded'));
    }, LOADER_SETTINGS.fadeOutDuration);
}

// Export utilities
export {
    LOADER_SETTINGS,
    initializeLoader,
    updateLoaderProgress
}; 