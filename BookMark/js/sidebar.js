/**
 * sidebar.js - 侧边栏控制模块
 * 职责：移动端侧边栏的展开/收起
 */

const Sidebar = {
    elements: {
        sidebar: null,
        overlay: null
    },

    /**
     * 初始化，缓存DOM元素
     */
    init() {
        this.elements.sidebar = document.querySelector('.sidebar');
        this.elements.overlay = document.querySelector('.sidebar-overlay');

        // 绑定遮罩点击事件
        this.elements.overlay.addEventListener('click', () => this.close());
    },

    /**
     * 切换侧边栏状态
     */
    toggle() {
        this.elements.sidebar.classList.toggle('active');
        this.elements.overlay.classList.toggle('active');
    },

    /**
     * 打开侧边栏
     */
    open() {
        this.elements.sidebar.classList.add('active');
        this.elements.overlay.classList.add('active');
    },

    /**
     * 关闭侧边栏
     */
    close() {
        this.elements.sidebar.classList.remove('active');
        this.elements.overlay.classList.remove('active');
    }
};
