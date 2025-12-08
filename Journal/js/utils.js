/**
 * utils.js - DOM工具和通用工具函数
 * 提供DOM操作、日期格式化等通用功能
 */

const JournalUtils = (function() {
    
    /**
     * 查询单个元素
     * @param {string} selector - CSS选择器
     * @param {Element} context - 上下文元素
     * @returns {Element|null}
     */
    function $(selector, context = document) {
        return context.querySelector(selector);
    }

    /**
     * 查询多个元素
     * @param {string} selector - CSS选择器
     * @param {Element} context - 上下文元素
     * @returns {NodeList}
     */
    function $$(selector, context = document) {
        return context.querySelectorAll(selector);
    }

    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attrs - 属性对象
     * @param {string|Element|Array} children - 子元素
     * @returns {Element}
     */
    function createElement(tag, attrs = {}, children = null) {
        const el = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'innerHTML') {
                el.innerHTML = value;
            } else if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                el.setAttribute(key, value);
            }
        });
        
        if (children) {
            if (typeof children === 'string') {
                el.innerHTML = children;
            } else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else if (child instanceof Element) {
                        el.appendChild(child);
                    }
                });
            } else if (children instanceof Element) {
                el.appendChild(children);
            }
        }
        
        return el;
    }

    /**
     * 从HTML字符串创建元素
     * @param {string} html - HTML字符串
     * @returns {Element}
     */
    function createElementFromHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstElementChild;
    }

    /**
     * 格式化日期为英文格式
     * @param {Date} date - 日期对象
     * @returns {string}
     */
    function formatDateEN(date = new Date()) {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    /**
     * 格式化日期为中文格式
     * @param {Date} date - 日期对象
     * @returns {string}
     */
    function formatDateCN(date = new Date()) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    /**
     * 格式化日期为ISO格式 (YYYY/MM/DD)
     * @param {Date} date - 日期对象
     * @returns {string}
     */
    function formatDateISO(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    /**
     * 转换为罗马数字
     * @param {number} num - 数字
     * @returns {string}
     */
    function toRoman(num) {
        const romanNumerals = {
            1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
            6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
        };
        return romanNumerals[num] || num.toString();
    }

    /**
     * 保存当前选区
     * @returns {Range|null}
     */
    function saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    }

    /**
     * 恢复选区
     * @param {Range} range - 选区对象
     */
    function restoreSelection(range) {
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * 查找最近的祖先元素
     * @param {Node} node - 起始节点
     * @param {string} selector - CSS选择器
     * @returns {Element|null}
     */
    function findAncestor(node, selector) {
        while (node && node !== document) {
            if (node.matches && node.matches(selector)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    /**
     * 查找最近的具有指定类名的祖先
     * @param {Node} node - 起始节点
     * @param {string} className - 类名
     * @returns {Element|null}
     */
    function findAncestorByClass(node, className) {
        while (node && node !== document) {
            if (node.classList && node.classList.contains(className)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间(ms)
     * @returns {Function}
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 生成唯一ID
     * @param {string} prefix - ID前缀
     * @returns {string}
     */
    function generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 公开API
    return {
        $,
        $$,
        createElement,
        createElementFromHTML,
        formatDateEN,
        formatDateCN,
        formatDateISO,
        toRoman,
        saveSelection,
        restoreSelection,
        findAncestor,
        findAncestorByClass,
        debounce,
        generateId
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalUtils;
}
