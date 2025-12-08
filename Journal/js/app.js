/**
 * app.js - 应用主入口
 * 初始化所有模块，提供全局API
 */

const JournalApp = (function() {
    
    /**
     * 初始化应用
     */
    function init() {
        // 初始化各模块
        JournalDialog.init();
        JournalMedia.init();
        JournalCover.setup();
        JournalStorage.setupAutoSave();
        JournalShortcuts.init();
        
        // 从本地存储加载数据
        JournalStorage.loadFromLocalStorage();
        
        console.log('Journal App initialized');
    }

    /**
     * 绑定工具栏按钮事件
     * 这些函数会被HTML中的onclick调用
     */
    
    // 编辑元数据
    window.showMetaSelector = function() {
        JournalDialog.openMetaDialog();
    };

    // 新增内容
    window.addNewEntry = function() {
        JournalEntry.addNew();
    };

    // 插入图片
    window.insertMedia = function(type) {
        JournalDialog.openMediaDialog(type);
    };

    // 插入笔记
    window.insertMarginNote = function() {
        JournalEntry.insertMarginNote();
    };

    // 插入引用
    window.insertQuote = function() {
        JournalEntry.insertQuote();
    };

    // 插入概念
    window.insertKeyConceptBox = function() {
        JournalEntry.insertKeyConcept();
    };

    // 新建章节
    window.insertNewChapter = function() {
        JournalChapter.insertNew();
    };

    // 导出JSON
    window.exportJSON = function() {
        JournalStorage.exportJSON();
    };

    // 导入JSON
    window.importJSON = function() {
        JournalStorage.importJSON();
    };

    // 关闭对话框
    window.closeDialog = function() {
        JournalDialog.closeMediaDialog();
    };

    // 关闭元数据对话框
    window.closeMetaDialog = function() {
        JournalDialog.closeMetaDialog();
    };

    // 确认插入媒体
    window.confirmInsertMedia = function() {
        JournalMedia.confirmInsertMedia();
    };

    // 确认更新元数据
    window.confirmUpdateMeta = function() {
        JournalDialog.confirmUpdateMeta();
    };

    // 滚动到条目
    window.scrollToEntry = function(entryId) {
        JournalTOC.scrollToEntry(entryId);
    };

    // 公开API
    return {
        init,
        // 暴露各模块供外部使用
        state: JournalState,
        utils: JournalUtils,
        storage: JournalStorage,
        dialog: JournalDialog,
        media: JournalMedia,
        toc: JournalTOC,
        chapter: JournalChapter,
        entry: JournalEntry,
        cover: JournalCover,
        shortcuts: JournalShortcuts
    };
})();

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    JournalApp.init();
});
