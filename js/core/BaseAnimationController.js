/* ==========================================================================
   Base Animation Controller
   ========================================================================== */

class BaseAnimationController {
    constructor() {
        this.animations = new Map();
        this.timeline = null;
        this.isPlaying = false;
    }

    // Animation Registration
    register(name, animation) {
        if (typeof animation !== 'function') {
            throw new Error('Animation must be a function');
        }
        this.animations.set(name, animation);
    }

    unregister(name) {
        this.animations.delete(name);
    }

    // Timeline Management
    createTimeline(config = {}) {
        this.timeline = gsap.timeline({
            paused: true,
            smoothChildTiming: true,
            ...config
        });
        return this.timeline;
    }

    clearTimeline() {
        if (this.timeline) {
            this.timeline.clear();
            this.timeline.kill();
        }
        this.timeline = null;
    }

    // Animation Control
    play(name, options = {}) {
        const animation = this.animations.get(name);
        if (!animation) return;

        this.isPlaying = true;
        return animation(options).then(() => {
            this.isPlaying = false;
        });
    }

    pause() {
        if (this.timeline) {
            this.timeline.pause();
        }
        this.isPlaying = false;
    }

    resume() {
        if (this.timeline) {
            this.timeline.resume();
        }
        this.isPlaying = true;
    }

    reverse() {
        if (this.timeline) {
            this.timeline.reverse();
        }
    }

    // Utility Methods
    getProgress() {
        return this.timeline ? this.timeline.progress() : 0;
    }

    setProgress(progress) {
        if (this.timeline) {
            this.timeline.progress(progress);
        }
    }

    getDuration() {
        return this.timeline ? this.timeline.duration() : 0;
    }

    // Event Handlers
    onComplete(callback) {
        if (this.timeline) {
            this.timeline.eventCallback('onComplete', callback);
        }
    }

    onStart(callback) {
        if (this.timeline) {
            this.timeline.eventCallback('onStart', callback);
        }
    }

    onUpdate(callback) {
        if (this.timeline) {
            this.timeline.eventCallback('onUpdate', callback);
        }
    }

    // Helper Methods
    async sequence(animations, options = {}) {
        const timeline = this.createTimeline(options);
        
        for (const [name, config] of animations) {
            const animation = this.animations.get(name);
            if (animation) {
                timeline.add(animation(config));
            }
        }
        
        return timeline;
    }

    async parallel(animations, options = {}) {
        const timeline = this.createTimeline(options);
        
        animations.forEach(([name, config]) => {
            const animation = this.animations.get(name);
            if (animation) {
                timeline.add(animation(config), 0);
            }
        });
        
        return timeline;
    }
}

export default BaseAnimationController; 