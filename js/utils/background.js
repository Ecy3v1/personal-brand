/* ==========================================================================
   Background Controller
   ========================================================================== */

class BackgroundController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initAmbientBackground();
        this.initParallaxEffect();
    }
    
    initAmbientBackground() {
        const background = document.querySelector('.ambient-background');
        if (!background) return;
        
        let timeout;
        
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            background.style.setProperty('--mouse-x', `${x}%`);
            background.style.setProperty('--mouse-y', `${y}%`);
            
            background.classList.add('active');
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                background.classList.remove('active');
            }, 2000);
        });
    }
    
    initParallaxEffect() {
        const shapes = document.querySelector('.organic-shapes');
        if (!shapes) return;
        
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            shapes.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // 添加滚动视差效果
        document.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const rate = scrolled * 0.5;
            
            shapes.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // 随机生成背景动画
    createRandomAnimation() {
        const shapes = document.querySelector('.organic-shapes');
        if (!shapes) return;
        
        const randomScale = 0.9 + Math.random() * 0.2;
        const randomRotate = -10 + Math.random() * 20;
        const randomDuration = 0.5 + Math.random() * 0.5;
        
        shapes.style.transition = `transform ${randomDuration}s var(--transition-bounce)`;
        shapes.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg)`;
        
        setTimeout(() => {
            shapes.style.transform = 'scale(1) rotate(0deg)';
        }, randomDuration * 1000);
    }
    
    // 开始随机背景动画
    startRandomAnimations() {
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% 的概率触发动画
                this.createRandomAnimation();
            }
        }, 5000); // 每5秒检查一次
    }
}

// 初始化背景控制器
document.addEventListener('DOMContentLoaded', () => {
    const backgroundController = new BackgroundController();
    backgroundController.startRandomAnimations();
}); 