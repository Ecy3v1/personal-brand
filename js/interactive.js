// DOM Elements
const appContainer = document.querySelector('.app-container');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');
let currentSection = 0;
let isScrolling = false;

// Mobile Navigation Toggle
navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile navigation when clicking outside
document.addEventListener('click', (e) => {
    if (navLinksContainer?.classList.contains('active') &&
        !e.target.closest('.nav-links') &&
        !e.target.closest('.nav-toggle')) {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    }
});

// Close mobile navigation when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navLinksContainer?.classList.remove('active');
    });
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(target);
        if (targetSection) {
            // Update current section index
            currentSection = Array.from(sections).indexOf(targetSection);
            scrollToSection(currentSection);
        }
    });
});

// Scroll Handler
function handleScroll(e) {
    if (isScrolling) return;
    e.preventDefault();
    
    const delta = e.deltaY;
    const direction = delta > 0 ? 1 : -1;
    
    if (direction > 0 && currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
    } else if (direction < 0 && currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
    }
}

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: 'smooth' });
    
    // Update active states
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[index]?.classList.add('active');
    
    // Update URL hash without scrolling
    const sectionId = sections[index].id;
    window.history.replaceState(null, '', `#${sectionId}`);
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Mouse Trail Effect
let dots = [];
const DOTS_COUNT = 12;
const DOT_SIZE = 3;

for (let i = 0; i < DOTS_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'mouse-trail-dot';
    dot.style.cssText = `
        width: ${DOT_SIZE}px;
        height: ${DOT_SIZE}px;
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transition: transform 0.1s linear;
        z-index: 9999;
    `;
    document.body.appendChild(dot);
    dots.push({
        element: dot,
        x: 0,
        y: 0,
    });
}

function updateTrail(e) {
    dots.forEach((dot, index) => {
        const nextDot = dots[index + 1] || dots[0];
        nextDot.x = e.clientX;
        nextDot.y = e.clientY;
        
        const scale = 1 - (index * 0.05);
        const opacity = 1 - (index * 0.08);
        
        dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
        dot.element.style.opacity = opacity;
    });
}

// Hover Effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});

// Event Listeners
window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('mousemove', updateTrail);

// Touch Events
let touchStartY = 0;
let touchStartX = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;
    
    // Calculate both vertical and horizontal deltas
    const deltaY = touchEndY - touchStartY;
    const deltaX = touchEndX - touchStartX;
    
    // Only handle vertical scrolling if it's the dominant direction
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? -1 : 1;
        if (direction > 0 && currentSection < sections.length - 1) {
            currentSection++;
            scrollToSection(currentSection);
        } else if (direction < 0 && currentSection > 0) {
            currentSection--;
            scrollToSection(currentSection);
        }
        touchStartY = touchEndY;
        touchStartX = touchEndX;
    }
}, { passive: false });

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    // Prevent default scrolling
    document.body.style.overflow = 'hidden';
    
    // Set initial section based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            currentSection = Array.from(sections).indexOf(targetSection);
            scrollToSection(currentSection);
        }
    }
    
    // Set initial active states
    if (navLinks[currentSection]) {
        navLinks[currentSection].classList.add('active');
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Disable form
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Here you would typically send the data to your server
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        submitButton.textContent = 'Message Sent!';
        submitButton.style.background = 'rgba(72, 187, 120, 0.2)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
        submitButton.textContent = 'Error - Try Again';
        submitButton.style.background = 'rgba(245, 101, 101, 0.2)';
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.background = '';
        }, 3000);
    }
});

// Form Input Animations
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    // Add focus class to parent form-group
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        
        // Add filled class if input has value
        if (input.value) {
            input.parentElement.classList.add('filled');
        } else {
            input.parentElement.classList.remove('filled');
        }
    });
});

// AI Assistant
class AIAssistant {
    constructor() {
        this.toggle = document.querySelector('.ai-toggle');
        this.window = document.querySelector('.ai-window');
        this.close = document.querySelector('.ai-close');
        this.messages = document.querySelector('.ai-messages');
        this.input = document.querySelector('.ai-input input');
        this.send = document.querySelector('.ai-send');
        
        this.isOpen = false;
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Toggle chat window
        this.toggle.addEventListener('click', () => this.toggleWindow());
        this.close.addEventListener('click', () => this.toggleWindow());
        
        // Send message
        this.send.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleWindow();
            }
        });
    }
    
    toggleWindow() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('hidden');
        
        if (this.isOpen) {
            this.input.focus();
        }
    }
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        
        // Simulate AI thinking
        await this.simulateTyping();
        
        // Add AI response
        const response = await this.getAIResponse(message);
        this.addMessage(response, 'assistant');
    }
    
    addMessage(text, type) {
        const message = document.createElement('div');
        message.className = `ai-message ${type}`;
        message.textContent = text;
        
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
    
    simulateTyping() {
        return new Promise(resolve => {
            this.addMessage('...', 'assistant');
            setTimeout(() => {
                this.messages.removeChild(this.messages.lastChild);
                resolve();
            }, 1000);
        });
    }
    
    async getAIResponse(message) {
        // Here you would typically make an API call to your AI service
        // For now, we'll return some simple responses
        const responses = [
            "I understand you're interested in that. Could you tell me more?",
            "That's an interesting point. Let me help you with that.",
            "I see what you mean. Here's what I think...",
            "Thanks for sharing that. Would you like to explore this further?",
            "I'm here to help. What specific aspects would you like to know more about?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize AI Assistant
document.addEventListener('DOMContentLoaded', () => {
    const assistant = new AIAssistant();
}); 