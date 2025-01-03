/* ==========================================================================
   Modal Controller
   ========================================================================== */

class ModalController {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.triggers = document.querySelectorAll('[data-modal]');
        this.closeButtons = document.querySelectorAll('.modal-close');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        // Handle modal triggers
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });
        
        // Handle close buttons
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(button.closest('.modal'));
            });
        });
        
        // Handle overlay clicks
        this.modals.forEach(modal => {
            modal.querySelector('.modal-overlay').addEventListener('click', () => {
                this.closeModal(modal);
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
        
        // Handle focus trap
        this.modals.forEach(modal => {
            this.trapFocus(modal);
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Close any active modal first
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
        
        // Open new modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        this.activeModal = modal;
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
            focusable.focus();
        }
        
        // Trigger open event
        modal.dispatchEvent(new CustomEvent('modal:open'));
    }
    
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.activeModal = null;
        
        // Return focus to trigger
        const triggerId = modal.id;
        const trigger = document.querySelector(`[data-modal="${triggerId}"]`);
        if (trigger) {
            trigger.focus();
        }
        
        // Trigger close event
        modal.dispatchEvent(new CustomEvent('modal:close'));
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
}

// Initialize modal controller
document.addEventListener('DOMContentLoaded', () => {
    new ModalController();
}); 
