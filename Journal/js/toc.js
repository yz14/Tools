/**
 * toc.js - 目录模块
 * 管理目录的生成和更新
 */

const JournalTOC = (function() {
    const { $, $$, createElement, toRoman } = JournalUtils;

    /**
     * 滚动到指定日记条目
     * @param {string} entryId - 条目ID
     */
    function scrollToEntry(entryId) {
        const entry = document.getElementById(entryId);
        if (entry) {
            entry.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * 更新目录
     */
    function update() {
        const tocContent = $('#tocContent');
        const contentPage = $('#contentPage');
        
        if (!tocContent || !contentPage) return;
        
        // 清空现有目录
        tocContent.innerHTML = '';
        
        let partNumber = 0;
        let currentChapter = null;
        let chapterEntries = [];
        
        // 处理book-container中的初始章节页（在content-page外的）
        const allChapterPages = $$('.chapter-page');
        const contentPageChapters = contentPage.querySelectorAll('.chapter-page');
        const initialChapters = Array.from(allChapterPages).filter(ch => !contentPage.contains(ch));

        // 如果有初始章节（章节0），先处理它
        if (initialChapters.length > 0) {
            initialChapters.forEach(chapter => {
                const chapterData = {
                    title: chapter.querySelector('.chapter-title-page')?.textContent || '未命名章节',
                    subtitle: chapter.querySelector('.chapter-subtitle')?.textContent || ''
                };
                
                // 收集章节0后面、第一个新章节之前的所有日记条目
                const entries = [];
                let node = contentPage.firstElementChild;
                while (node && !node.classList.contains('chapter-page')) {
                    if (node.classList.contains('journal-entry')) {
                        entries.push({
                            id: node.id,
                            title: node.querySelector('.entry-title')?.textContent || '未命名',
                            number: `${partNumber}.${entries.length}`,
                            page: 3 + entries.length * 4
                        });
                    }
                    node = node.nextElementSibling;
                }
                createTocPart(tocContent, chapterData, entries, partNumber++);
            });
        }

        // 遍历content-page中的内容
        contentPage.childNodes.forEach((node, index) => {
            if (node.classList) {
                if (node.classList.contains('chapter-page')) {
                    // 如果之前有章节，先保存
                    if (currentChapter) {
                        createTocPart(tocContent, currentChapter, chapterEntries, partNumber++);
                    }
                    chapterEntries = [];
                    
                    // 记录新章节
                    currentChapter = {
                        title: node.querySelector('.chapter-title-page')?.textContent || '未命名章节',
                        subtitle: node.querySelector('.chapter-subtitle')?.textContent || ''
                    };
                } else if (node.classList.contains('journal-entry')) {
                    const entry = {
                        id: node.id || `entry${index + 1}`,
                        title: node.querySelector('.entry-title')?.textContent || '未命名',
                        number: `${partNumber}.${chapterEntries.length}`,
                        page: index * 4 + 3
                    };
                    chapterEntries.push(entry);
                }
            }
        });
        
        // 处理最后一个章节
        if (currentChapter || chapterEntries.length > 0) {
            createTocPart(tocContent, currentChapter || {title: '前言'}, chapterEntries, partNumber);
        }
    }

    /**
     * 创建目录部分
     * @param {Element} tocContent - 目录容器
     * @param {Object} chapter - 章节数据
     * @param {Array} entries - 条目数组
     * @param {number} partNum - 部分编号
     */
    function createTocPart(tocContent, chapter, entries, partNum) {
        if (entries.length === 0) return;
        
        const partDiv = createElement('div', { className: 'toc-part' });
        
        const partHeader = createElement('div', { className: 'part-header' });
        partHeader.textContent = `Part ${toRoman(partNum)}: ${chapter.title}`;
        partDiv.appendChild(partHeader);
        
        entries.forEach(entry => {
            const tocEntry = createElement('div', { 
                className: 'toc-entry',
                onClick: () => scrollToEntry(entry.id)
            });
            tocEntry.innerHTML = `
                <span class="toc-number">${entry.number}</span>
                <span class="toc-title">${entry.title}</span>
                <span class="toc-dots"></span>
                <span class="toc-page-num">${entry.page}</span>
            `;
            partDiv.appendChild(tocEntry);
        });
        
        tocContent.appendChild(partDiv);
    }

    // 公开API
    return {
        scrollToEntry,
        update
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalTOC;
}
