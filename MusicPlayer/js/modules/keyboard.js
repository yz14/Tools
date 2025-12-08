/**
 * 键盘快捷键模块
 */

import { eventBus, EVENTS } from './eventBus.js';

class KeyboardController {
    constructor() {
        this.enabled = true;
    }

    /**
     * 初始化键盘监听
     */
    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeydown(e) {
        if (!this.enabled) return;

        // 如果焦点在输入框，不处理快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                eventBus.emit('keyboard:playToggle');
                break;
            case 'ArrowLeft':
                eventBus.emit('keyboard:prev');
                break;
            case 'ArrowRight':
                eventBus.emit('keyboard:next');
                break;
            case 'ArrowUp':
                e.preventDefault();
                eventBus.emit('keyboard:volumeUp');
                break;
            case 'ArrowDown':
                e.preventDefault();
                eventBus.emit('keyboard:volumeDown');
                break;
            case 'KeyM':
                eventBus.emit('keyboard:mute');
                break;
            case 'KeyL':
                eventBus.emit('keyboard:loopToggle');
                break;
        }
    }

    /**
     * 启用键盘控制
     */
    enable() {
        this.enabled = true;
    }

    /**
     * 禁用键盘控制
     */
    disable() {
        this.enabled = false;
    }
}

// 导出单例
export const keyboardController = new KeyboardController();
