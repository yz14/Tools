/**
 * toast.js - Toast提示模块
 * 职责：显示临时消息提示
 */

const Toast = {
    element: null,
    timer: null,

    /**
     * 初始化，缓存DOM元素
     */
    init() {
        this.element = document.getElementById('toast');
    },

    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {string} type - 类型：'success' 或 'error'
     * @param {number} duration - 显示时长（毫秒）
     */
    show(message, type = 'success', duration = 3000) {
        // 清除之前的定时器
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.element.textContent = message;
        this.element.style.background = type === 'error'
            ? 'var(--danger-color)'
            : 'var(--success-color)';
        this.element.classList.add('show');

        this.timer = setTimeout(() => {
            this.element.classList.remove('show');
        }, duration);
    },

    /**
     * 隐藏提示
     */
    hide() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.element.classList.remove('show');
    }
};
