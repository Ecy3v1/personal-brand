/* ==========================================================================
   Sketch Animation Controller
   ========================================================================== */

class SketchController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initIntersectionObserver();
        this.initHoverEffects();
        this.initRandomScribbles();
    }
    
    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 重置动画
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; // 触发重排
                    entry.target.style.animation = null;
                    
                    // 添加动画类
                    if (entry.target.classList.contains('sketch-line')) {
                        entry.target.classList.add('animate-sketch-line');
                    } else if (entry.target.classList.contains('sketch-border')) {
                        entry.target.classList.add('animate-sketch-border');
                    }
                    // ... 其他动画类型
                    
                    // 移除观察
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // 观察所有带有 sketch-* 类的元素
        document.querySelectorAll('[class*="sketch-"]').forEach(element => {
            observer.observe(element);
        });
    }
    
    initHoverEffects() {
        // 鼠标悬停效果
        document.querySelectorAll('.sketch-highlight').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'none';
                element.offsetHeight;
                element.style.animation = null;
            });
        });
    }
    
    initRandomScribbles() {
        // 随机涂鸦效果
        const scribbles = document.querySelectorAll('.sketch-scribble');
        if (scribbles.length === 0) return;
        
        setInterval(() => {
            const randomScribble = scribbles[Math.floor(Math.random() * scribbles.length)];
            randomScribble.style.animation = 'none';
            randomScribble.offsetHeight;
            randomScribble.style.animation = null;
        }, 3000);
    }
    
    // 手动触发动画
    triggerAnimation(element) {
        if (!element) return;
        
        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = null;
    }
    
    // 创建新的涂鸦元素
    createScribble(container, options = {}) {
        const scribble = document.createElement('div');
        scribble.classList.add('sketch-scribble');
        
        if (options.position) {
            scribble.style.position = 'absolute';
            scribble.style.top = options.position.top || '0';
            scribble.style.left = options.position.left || '0';
        }
        
        if (options.size) {
            scribble.style.width = options.size.width || '50px';
            scribble.style.height = options.size.height || '50px';
        }
        
        if (options.rotation) {
            scribble.style.transform = `rotate(${options.rotation}deg)`;
        }
        
        container.appendChild(scribble);
        return scribble;
    }
    
    // 创建手绘箭头
    createArrow(container, direction = 'right') {
        const arrow = document.createElement('div');
        arrow.classList.add('sketch-arrow');
        
        switch (direction) {
            case 'left':
                arrow.style.transform = 'scaleX(-1)';
                break;
            case 'up':
                arrow.style.transform = 'rotate(-90deg)';
                break;
            case 'down':
                arrow.style.transform = 'rotate(90deg)';
                break;
        }
        
        container.appendChild(arrow);
        return arrow;
    }
    
    // 创建手绘高亮
    createHighlight(element, color = 'var(--color-yellow)') {
        const highlight = document.createElement('div');
        highlight.classList.add('sketch-highlight');
        highlight.style.setProperty('--highlight-color', color);
        
        // 包装目标元素
        element.parentNode.insertBefore(highlight, element);
        highlight.appendChild(element);
        
        return highlight;
    }
}

// 初始化素描控制器
document.addEventListener('DOMContentLoaded', () => {
    window.sketchController = new SketchController();
}); 