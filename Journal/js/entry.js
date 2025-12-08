/**
 * entry.js - 日记条目模块
 * 管理日记条目的创建、编辑和组件插入
 */

const JournalEntry = (function() {
    const { $, $$, createElementFromHTML, formatDateEN, findAncestorByClass } = JournalUtils;

    /**
     * 添加新日记条目
     */
    function addNew() {
        const contentPage = $('#contentPage');
        const entryId = JournalState.incrementEntryCount();
        
        const today = new Date();
        const dateStr = formatDateEN(today);
        
        const newEntry = createElementFromHTML(`
            <div class="journal-entry" id="entry${entryId}">
                <div class="entry-header">
                    <div class="entry-date">${dateStr}</div>
                    <h3 class="entry-title editable" contenteditable="true">新的一天</h3>
                    <div class="entry-meta">
                        <span class="meta-item">
                            <span class="meta-icon">🌤️</span>
                            天气
                        </span>
                        <span class="meta-item">
                            <span class="meta-icon">📍</span>
                            地点
                        </span>
                        <span class="meta-item">
                            <span class="meta-icon">💭</span>
                            心情
                        </span>
                    </div>
                </div>
                <div class="entry-content editable" contenteditable="true">
                    <p>在这里开始记录今天的故事...</p>
                </div>
            </div>
        `);
        
        // 插入到最后一个journal-entry之后
        const lastEntry = contentPage.querySelector('.journal-entry:last-of-type');
        if (lastEntry && lastEntry.nextSibling) {
            lastEntry.parentNode.insertBefore(newEntry, lastEntry.nextSibling);
        } else {
            contentPage.appendChild(newEntry);
        }
        
        newEntry.scrollIntoView({ behavior: 'smooth' });
        
        // 更新目录
        JournalTOC.update();
        
        // 聚焦到标题并选中
        const titleElement = newEntry.querySelector('.entry-title');
        titleElement.focus();
        
        const range = document.createRange();
        range.selectNodeContents(titleElement);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * 插入侧边笔记
     */
    function insertMarginNote() {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            alert('请先在日记内容中选择插入位置');
            return;
        }

        const savedRange = selection.getRangeAt(0);
        
        let node = selection.anchorNode;
        let targetContent = null;
        while (node && node !== document) {
            if (node.classList && node.classList.contains('entry-content')) {
                targetContent = node;
                break;
            }
            node = node.parentNode;
        }
        
        if (!targetContent) {
            alert('请在日记内容中选择插入位置');
            return;
        }
        
        const noteElement = createElementFromHTML(`
            <div class="margin-note">
                <div class="margin-note-title editable" contenteditable="true">笔记标题</div>
                <div class="editable" contenteditable="true">在此输入笔记内容...</div>
            </div>
        `);
        
        try {
            savedRange.insertNode(noteElement);
        } catch(e) {
            targetContent.appendChild(noteElement);
        }
    }

    /**
     * 插入引用框
     */
    function insertQuote() {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            alert('请先在日记内容中选择插入位置');
            return;
        }
        
        let currentP = null;
        let node = selection.anchorNode;
        while (node && node !== document) {
            if (node.tagName === 'P') {
                currentP = node;
                break;
            }
            if (node.classList && node.classList.contains('entry-content')) {
                break;
            }
            node = node.parentNode;
        }
        
        const quoteElement = createElementFromHTML(`
            <div class="textbook-quote editable" contenteditable="true">
                在此输入引用内容...
            </div>
        `);
        
        if (currentP && currentP.parentNode) {
            currentP.parentNode.insertBefore(quoteElement, currentP.nextSibling);
        } else {
            const range = selection.getRangeAt(0);
            range.insertNode(quoteElement);
        }
    }

    /**
     * 插入概念框
     */
    function insertKeyConcept() {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            alert('请先在日记内容中选择插入位置');
            return;
        }
        
        let currentP = null;
        let node = selection.anchorNode;
        while (node && node !== document) {
            if (node.tagName === 'P') {
                currentP = node;
                break;
            }
            if (node.classList && node.classList.contains('entry-content')) {
                break;
            }
            node = node.parentNode;
        }
        
        const conceptElement = createElementFromHTML(`
            <div class="key-concept">
                <div class="key-concept-header">
                    <span>💡</span> <span class="editable" contenteditable="true">重要概念</span>
                </div>
                <div class="editable" contenteditable="true">在此输入概念内容...</div>
            </div>
        `);
        
        if (currentP && currentP.parentNode) {
            currentP.parentNode.insertBefore(conceptElement, currentP.nextSibling);
        } else {
            const range = selection.getRangeAt(0);
            range.insertNode(conceptElement);
        }
    }

    // 公开API
    return {
        addNew,
        insertMarginNote,
        insertQuote,
        insertKeyConcept
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalEntry;
}
