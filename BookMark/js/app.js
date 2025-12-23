/**
 * app.js - 应用主入口
 * 职责：初始化各模块、协调模块间交互、处理业务逻辑
 */

const App = {
    /**
     * 初始化应用
     */
    init() {
        // 初始化各模块
        Store.init();
        Render.init();
        Modal.init();
        Toast.init();
        Sidebar.init();

        // 渲染界面
        Render.renderCategories();
    },

    /**
     * 选择大类
     * @param {string} category
     */
    selectCategory(category) {
        Store.selectCategory(category);
        Render.renderCategories();
        Render.renderSubcategories();
        Render.renderContent();
    },

    /**
     * 选择小类
     * @param {string} subcategory
     */
    selectSubcategory(subcategory) {
        Store.selectSubcategory(subcategory);
        Render.renderSubcategories();
        Render.renderContent();
    },

    /**
     * 移动端选择大类（自动关闭侧边栏）
     * @param {string} category
     */
    selectCategoryMobile(category) {
        this.selectCategory(category);
        if (Utils.isMobile()) {
            setTimeout(() => Sidebar.close(), 150);
        }
    },

    /**
     * 移动端选择小类（自动关闭侧边栏）
     * @param {string} subcategory
     */
    selectSubcategoryMobile(subcategory) {
        this.selectSubcategory(subcategory);
        if (Utils.isMobile()) {
            setTimeout(() => Sidebar.close(), 150);
        }
    },

    /**
     * 显示新增书签弹窗
     */
    showAddModal() {
        Modal.show();
    },

    /**
     * 关闭弹窗
     */
    closeModal() {
        Modal.close();
    },

    /**
     * 添加书签
     */
    addBookmark() {
        const formData = Modal.getFormData();
        if (!formData) return;

        const { category, subcategory, title, url } = formData;

        Store.addBookmark(category, subcategory, title, url);

        // 更新界面
        Render.renderCategories();
        if (Store.currentCategory === category) {
            Render.renderSubcategories();
            if (Store.currentSubcategory === subcategory) {
                Render.renderContent();
            }
        }

        Modal.close();
        Toast.show('书签添加成功');
    },

    /**
     * 删除书签
     * @param {number} index
     */
    deleteBookmark(index) {
        if (!confirm('确定要删除这个书签吗？')) return;

        Store.deleteBookmark(index);
        Render.renderAll();
        Toast.show('书签已删除');
    },

    /**
     * 导出数据
     */
    exportData() {
        Utils.exportData();
    },

    /**
     * 导入数据
     * @param {Event} event
     */
    importData(event) {
        Utils.importData(event);
    },

    /**
     * 重置数据
     */
    clearCache() {
        if (!confirm('确定要重置为默认数据吗？当前所有数据将被清除！')) return;

        Store.reset();
        Render.renderAll();
        Toast.show('数据已重置');
    },

    /**
     * 切换侧边栏
     */
    toggleSidebar() {
        Sidebar.toggle();
    },

    /**
     * 搜索处理
     * @param {string} query
     */
    handleSearch(query) {
        Render.renderSearchResults(query.trim().toLowerCase());
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
