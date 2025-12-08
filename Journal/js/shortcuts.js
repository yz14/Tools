/**
 * shortcuts.js - 快捷键模块
 * 管理键盘快捷键
 */

const JournalShortcuts = (function() {

    // 快捷键配置
    const shortcuts = {
        's': { ctrl: true, action: 'save', description: '保存/导出JSON' },
        'o': { ctrl: true, action: 'open', description: '打开/导入JSON' },
        'n': { ctrl: true, action: 'newEntry', description: '新建日记条目' }
    };

    /**
     * 处理快捷键
     * @param {KeyboardEvent} e - 键盘事件
     */
    function handleKeydown(e) {
        const key = e.key.toLowerCase();
        const shortcut = shortcuts[key];
        
        if (!shortcut) return;
        
        const ctrlOrMeta = e.ctrlKey || e.metaKey;
        
        if (shortcut.ctrl && ctrlOrMeta) {
            e.preventDefault();
            executeAction(shortcut.action);
        }
    }

    /**
     * 执行快捷键动作
     * @param {string} action - 动作名称
     */
    function executeAction(action) {
        switch (action) {
            case 'save':
                JournalStorage.exportJSON();
                break;
            case 'open':
                JournalStorage.importJSON();
                break;
            case 'newEntry':
                JournalEntry.addNew();
                break;
            default:
                console.warn('未知的快捷键动作:', action);
        }
    }

    /**
     * 注册自定义快捷键
     * @param {string} key - 按键
     * @param {Object} config - 配置对象 { ctrl: boolean, action: string, description: string }
     */
    function register(key, config) {
        shortcuts[key.toLowerCase()] = config;
    }

    /**
     * 移除快捷键
     * @param {string} key - 按键
     */
    function unregister(key) {
        delete shortcuts[key.toLowerCase()];
    }

    /**
     * 获取所有快捷键
     * @returns {Object}
     */
    function getAll() {
        return { ...shortcuts };
    }

    /**
     * 初始化快捷键监听
     */
    function init() {
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * 销毁快捷键监听
     */
    function destroy() {
        document.removeEventListener('keydown', handleKeydown);
    }

    // 公开API
    return {
        init,
        destroy,
        register,
        unregister,
        getAll
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalShortcuts;
}
