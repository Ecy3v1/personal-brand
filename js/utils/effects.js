/* ==========================================================================
   Effects Controller
   ========================================================================== */

class EffectsController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initGlowEffect();
        this.initTiltEffect();
        this.initGlitchEffect();
    }
    
    initGlowEffect() {
        const glowElements = document.querySelectorAll('.hover-glow');
        
        glowElements.forEach(element => {
            element.addEventListener('mousemove', e => {
                const rect = element.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                element.style.setProperty('--mouse-x', `${x}%`);
                element.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }
    
    initTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', e => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                element.style.setProperty('--rotate-x', `${rotateX}deg`);
                element.style.setProperty('--rotate-y', `${rotateY}deg`);
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--rotate-x', '0deg');
                element.style.setProperty('--rotate-y', '0deg');
            });
        });
    }
    
    initGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
            
            element.addEventListener('mouseenter', () => {
                element.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('active');
            });
        });
    }
    
    // 随机生成故障效果
    createRandomGlitch() {
        const elements = document.querySelectorAll('.glitch');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (randomElement) {
            randomElement.classList.add('active');
            setTimeout(() => {
                randomElement.classList.remove('active');
            }, 200);
        }
    }
    
    // 开始定期生成随机故障效果
    startRandomGlitches() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% 的概率触发故障效果
                this.createRandomGlitch();
            }
        }, 3000); // 每3秒检查一次
    }
}

// 初始化效果控制器
document.addEventListener('DOMContentLoaded', () => {
    const effectsController = new EffectsController();
    effectsController.startRandomGlitches();
}); 