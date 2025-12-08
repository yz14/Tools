/**
 * 背景动画模块
 */

class BackgroundAnimation {
    constructor() {
        this.container = null;
        this.circleCount = 6; // 减少圆圈数量以节省性能
        this.isReduced = false;
    }

    /**
     * 初始化背景动画
     * @param {string} containerId - 容器元素ID
     */
    init(containerId = 'bgAnimation') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 检测是否需要降低性能模式（移动设备或低性能设备）
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!this.isReduced) {
            this.createCircles();
        }
        
        // 页面不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (this.container) {
                this.container.style.animationPlayState = document.hidden ? 'paused' : 'running';
            }
        });
    }

    /**
     * 创建动画圆圈
     */
    createCircles() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = document.createElement('div');
            circle.className = 'bg-circle';
            
            const size = Math.random() * 250 + 80;
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.left = Math.random() * 100 + '%';
            circle.style.top = Math.random() * 100 + '%';
            circle.style.animationDelay = Math.random() * 5 + 's';
            // 使用 will-change 提示浏览器优化
            circle.style.willChange = 'transform, opacity';
            
            this.container.appendChild(circle);
        }
    }

    /**
     * 清除动画
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * 重新生成动画
     */
    regenerate() {
        this.clear();
        this.createCircles();
    }
}

// 导出单例
export const backgroundAnimation = new BackgroundAnimation();
