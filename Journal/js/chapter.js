/**
 * chapter.js - 章节模块
 * 管理章节的创建和操作
 */

const JournalChapter = (function() {
    const { $, $$, createElementFromHTML } = JournalUtils;

    /**
     * 插入新章节
     */
    function insertNew() {
        const contentPage = $('#contentPage');
        const lastEntry = contentPage.querySelector('.journal-entry:last-of-type');
        
        const chapterNumber = $$('.chapter-page').length;
        const chapterHTML = `
            <div class="chapter-page">
                <div class="chapter-number-large">${String(chapterNumber).padStart(2, '0')}</div>
                <div class="chapter-content">
                    <h2 class="chapter-title-page editable" contenteditable="true">新章节标题</h2>
                    <p class="chapter-subtitle editable" contenteditable="true">章节副标题</p>
                </div>
            </div>
        `;
        
        const chapterElement = createElementFromHTML(chapterHTML);
        
        if (lastEntry && lastEntry.nextSibling) {
            lastEntry.parentNode.insertBefore(chapterElement, lastEntry.nextSibling);
        } else {
            contentPage.appendChild(chapterElement);
        }

        // 更新目录
        JournalTOC.update();
        
        // 滚动到新章节
        chapterElement.scrollIntoView({ behavior: 'smooth' });
        
        // 聚焦到标题
        const titleElement = chapterElement.querySelector('.chapter-title-page');
        if (titleElement) {
            titleElement.focus();
            // 选中默认文本
            const range = document.createRange();
            range.selectNodeContents(titleElement);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    // 公开API
    return {
        insertNew
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalChapter;
}
