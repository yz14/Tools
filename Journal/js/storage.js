/**
 * storage.js - 存储模块
 * 处理本地存储、JSON导入导出
 */

const JournalStorage = (function() {
    const STORAGE_KEY = 'textbook-journal';

    /**
     * 保存到本地存储
     */
    function saveToLocalStorage() {
        const { $, $$ } = JournalUtils;
        
        const data = {
            version: "1.0",
            saveDate: new Date().toISOString(),
            coverImage: $('.cover-image')?.src || '',
            author: $('.cover-author')?.textContent || '',
            entries: []
        };
        
        $$('.journal-entry').forEach((entry, index) => {
            data.entries.push({
                id: entry.id,
                html: entry.outerHTML,
                order: index
            });
        });
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('自动保存成功');
        } catch (e) {
            console.error('自动保存失败:', e);
        }
    }

    /**
     * 从本地存储加载
     */
    function loadFromLocalStorage() {
        const { $ } = JournalUtils;
        
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            
            const data = JSON.parse(saved);
            
            // 恢复封面信息
            if (data.coverImage) {
                const coverImage = $('.cover-image');
                if (coverImage) coverImage.src = data.coverImage;
            }
            if (data.author) {
                const coverAuthor = $('.cover-author');
                if (coverAuthor) coverAuthor.textContent = data.author;
            }
            
        } catch (e) {
            console.error('加载本地数据失败:', e);
        }
    }

    /**
     * 导出为JSON文件
     */
    function exportJSON() {
        const { $, $$ } = JournalUtils;
        
        const data = {
            version: "1.0",
            exportDate: new Date().toISOString(),
            coverImage: $('.cover-image')?.src || '',
            author: $('.cover-author')?.textContent || '',
            entries: [],
            chapters: [],
            contentOrder: []
        };
        
        const contentPage = $('#contentPage');
        let globalOrder = 0;
        
        contentPage.childNodes.forEach(node => {
            if (node.classList) {
                if (node.classList.contains('chapter-page')) {
                    const chapterData = {
                        number: node.querySelector('.chapter-number-large')?.textContent || '',
                        title: node.querySelector('.chapter-title-page')?.textContent || '',
                        subtitle: node.querySelector('.chapter-subtitle')?.textContent || '',
                        order: globalOrder++,
                        type: 'chapter'
                    };
                    data.chapters.push(chapterData);
                    data.contentOrder.push({type: 'chapter', index: data.chapters.length - 1});
                } else if (node.classList.contains('journal-entry')) {
                    const entryData = {
                        id: node.id,
                        date: node.querySelector('.entry-date')?.textContent || '',
                        title: node.querySelector('.entry-title')?.textContent || '',
                        meta: [],
                        content: node.querySelector('.entry-content')?.innerHTML || '',
                        order: globalOrder++,
                        type: 'entry'
                    };
                    
                    // 收集元数据
                    node.querySelectorAll('.meta-item').forEach(meta => {
                        const icon = meta.querySelector('.meta-icon');
                        entryData.meta.push({
                            icon: icon?.textContent || '',
                            text: meta.textContent.replace(icon?.textContent || '', '').trim()
                        });
                    });
                    
                    data.entries.push(entryData);
                    data.contentOrder.push({type: 'entry', index: data.entries.length - 1});
                }
            }
        });
        
        // 创建并下载文件
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `journal_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('日记已导出为JSON文件');
    }

    /**
     * 从JSON文件导入
     */
    function importJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (!data.entries || !Array.isArray(data.entries)) {
                        throw new Error('无效的JSON格式');
                    }
                    
                    if (confirm('导入将替换当前所有内容，是否继续？')) {
                        applyImportedData(data);
                        alert('日记导入成功！');
                    }
                } catch (error) {
                    alert('导入失败：' + error.message);
                    console.error('Import error:', error);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * 应用导入的数据
     * @param {Object} data - 导入的数据
     */
    function applyImportedData(data) {
        const { $ } = JournalUtils;
        
        // 设置封面信息
        if (data.coverImage) {
            const coverImage = $('.cover-image');
            if (coverImage) coverImage.src = data.coverImage;
        }
        if (data.author) {
            const coverAuthor = $('.cover-author');
            if (coverAuthor) coverAuthor.textContent = data.author;
        }
        
        // 清空现有内容
        const contentPage = $('#contentPage');
        contentPage.querySelectorAll('.journal-entry, .chapter-page').forEach(el => el.remove());
        
        // 按顺序导入内容
        if (data.contentOrder && Array.isArray(data.contentOrder)) {
            data.contentOrder.forEach(item => {
                if (item.type === 'chapter' && data.chapters[item.index]) {
                    insertChapter(contentPage, data.chapters[item.index]);
                } else if (item.type === 'entry' && data.entries[item.index]) {
                    insertEntry(contentPage, data.entries[item.index]);
                }
            });
        } else {
            // 旧版本兼容
            if (data.chapters && Array.isArray(data.chapters)) {
                data.chapters.sort((a, b) => a.order - b.order).forEach(chapterData => {
                    insertChapter(contentPage, chapterData);
                });
            }
            data.entries.sort((a, b) => a.order - b.order).forEach(entryData => {
                insertEntry(contentPage, entryData);
            });
        }
        
        // 更新状态和目录
        JournalState.set('currentEntryCount', data.entries.length);
        if (typeof JournalTOC !== 'undefined') {
            JournalTOC.update();
        }
    }

    /**
     * 插入章节
     */
    function insertChapter(contentPage, chapterData) {
        const { createElementFromHTML, $ } = JournalUtils;
        
        const chapter = createElementFromHTML(`
            <div class="chapter-page">
                <div class="chapter-number-large">${chapterData.number}</div>
                <div class="chapter-content">
                    <h2 class="chapter-title-page editable" contenteditable="true">${chapterData.title}</h2>
                    <p class="chapter-subtitle editable" contenteditable="true">${chapterData.subtitle}</p>
                </div>
            </div>
        `);
        
        const references = contentPage.querySelector('.references');
        if (references) {
            contentPage.insertBefore(chapter, references);
        } else {
            contentPage.appendChild(chapter);
        }
    }

    /**
     * 插入日记条目
     */
    function insertEntry(contentPage, entryData) {
        const { createElementFromHTML, $ } = JournalUtils;
        
        let metaHTML = '';
        entryData.meta.forEach(meta => {
            metaHTML += `
                <span class="meta-item">
                    <span class="meta-icon">${meta.icon}</span>
                    ${meta.text}
                </span>
            `;
        });
        
        const entry = createElementFromHTML(`
            <div class="journal-entry" id="${entryData.id}">
                <div class="entry-header">
                    <div class="entry-date">${entryData.date}</div>
                    <h3 class="entry-title editable" contenteditable="true">${entryData.title}</h3>
                    <div class="entry-meta">${metaHTML}</div>
                </div>
                <div class="entry-content editable" contenteditable="true">
                    ${entryData.content}
                </div>
            </div>
        `);
        
        const references = contentPage.querySelector('.references');
        if (references) {
            contentPage.insertBefore(entry, references);
        } else {
            contentPage.appendChild(entry);
        }
    }

    /**
     * 设置自动保存
     */
    function setupAutoSave() {
        const debouncedSave = JournalUtils.debounce(saveToLocalStorage, 1000);
        
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('editable')) {
                debouncedSave();
            }
        });
    }

    // 公开API
    return {
        saveToLocalStorage,
        loadFromLocalStorage,
        exportJSON,
        importJSON,
        setupAutoSave
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalStorage;
}
