/**
 * utils.js - 工具函数模块
 * 职责：数据导入/导出、通用工具函数
 */

const Utils = {
    /**
     * 导出数据为JSON文件
     */
    exportData() {
        const dataStr = Store.export();
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const fileName = `bookmarks_${new Date().toISOString().slice(0, 10)}.json`;

        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', fileName);
        link.click();

        Toast.show('数据导出成功');
    },

    /**
     * 导入数据
     * @param {Event} event - 文件选择事件
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Store.import(imported)) {
                    Render.renderAll();
                    Toast.show('数据导入成功');
                } else {
                    Toast.show('无效的数据格式', 'error');
                }
            } catch (error) {
                Toast.show('导入失败：' + error.message, 'error');
            }
        };
        reader.readAsText(file);

        // 清空文件输入，允许重复选择同一文件
        event.target.value = '';
    },

    /**
     * 验证URL格式
     * @param {string} url
     * @returns {boolean}
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * 判断是否为移动端
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth <= 768;
    }
};
