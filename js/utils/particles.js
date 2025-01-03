/* ==========================================================================
   Particle System
   ========================================================================== */

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.lastMousePosition = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // 设置画布
        this.canvas.classList.add('particle-canvas');
        document.querySelector('.app-container').appendChild(this.canvas);
        
        // 设置全屏
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 鼠标事件
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.isMouseMoving = true;
            
            // 计算鼠标移动速度
            const dx = this.mousePosition.x - this.lastMousePosition.x;
            const dy = this.mousePosition.y - this.lastMousePosition.y;
            const speed = Math.sqrt(dx * dx + dy * dy);
            
            // 根据移动速度创建粒子
            if (speed > 5) {
                this.createParticles(3);
            }
            
            this.lastMousePosition = { ...this.mousePosition };
        });
        
        // 定时重置鼠标移动状态
        setInterval(() => {
            this.isMouseMoving = false;
        }, 100);
        
        // 开始动画
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles(count = 1) {
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 3 + 1;
            const speedX = (Math.random() - 0.5) * 4;
            const speedY = (Math.random() - 0.5) * 4;
            const life = Math.random() * 1 + 0.5;
            const color = Math.random() < 0.5 ? 'var(--color-red)' : 'var(--color-yellow)';
            
            this.particles.push({
                x: this.mousePosition.x,
                y: this.mousePosition.y,
                size,
                speedX,
                speedY,
                life,
                opacity: 1,
                color
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 更新生命周期
            p.life -= 0.02;
            p.opacity = p.life;
            
            // 移除死亡粒子
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`);
            this.ctx.fill();
        });
    }
    
    animate() {
        // 自动生成粒子
        if (!this.isMouseMoving && Math.random() < 0.1) {
            this.mousePosition.x = Math.random() * this.canvas.width;
            this.mousePosition.y = Math.random() * this.canvas.height;
            this.createParticles(1);
        }
        
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ��始化粒子系统
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
}); 