/**
 * state.js - 全局状态管理模块
 * 管理应用的全局状态，提供状态订阅机制
 */

const JournalState = (function() {
    // 私有状态
    let state = {
        currentMediaType: 'image',
        figureCounter: 1,
        videoCounter: 1,
        currentEntryCount: 3,
        savedSelection: null,
        currentEntryForMeta: null
    };

    // 订阅者列表
    const subscribers = {};

    /**
     * 获取状态值
     * @param {string} key - 状态键名
     * @returns {*} 状态值
     */
    function get(key) {
        return state[key];
    }

    /**
     * 设置状态值
     * @param {string} key - 状态键名
     * @param {*} value - 状态值
     */
    function set(key, value) {
        const oldValue = state[key];
        state[key] = value;
        
        // 通知订阅者
        if (subscribers[key]) {
            subscribers[key].forEach(callback => callback(value, oldValue));
        }
    }

    /**
     * 订阅状态变化
     * @param {string} key - 状态键名
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    function subscribe(key, callback) {
        if (!subscribers[key]) {
            subscribers[key] = [];
        }
        subscribers[key].push(callback);
        
        // 返回取消订阅函数
        return function unsubscribe() {
            const index = subscribers[key].indexOf(callback);
            if (index > -1) {
                subscribers[key].splice(index, 1);
            }
        };
    }

    /**
     * 增加计数器
     * @param {string} counterName - 计数器名称 ('figureCounter' 或 'videoCounter')
     * @returns {number} 增加前的值
     */
    function incrementCounter(counterName) {
        const currentValue = state[counterName];
        state[counterName] = currentValue + 1;
        return currentValue;
    }

    /**
     * 增加条目计数
     * @returns {number} 新的条目ID
     */
    function incrementEntryCount() {
        state.currentEntryCount++;
        return state.currentEntryCount;
    }

    /**
     * 重置状态
     */
    function reset() {
        state = {
            currentMediaType: 'image',
            figureCounter: 1,
            videoCounter: 1,
            currentEntryCount: 3,
            savedSelection: null,
            currentEntryForMeta: null
        };
    }

    // 公开API
    return {
        get,
        set,
        subscribe,
        incrementCounter,
        incrementEntryCount,
        reset
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalState;
}
