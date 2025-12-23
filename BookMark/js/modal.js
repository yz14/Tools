/**
 * modal.js - 模态框管理模块
 * 职责：模态框的显示、隐藏、表单处理
 */

const Modal = {
    // DOM元素缓存
    elements: {
        modal: null,
        categoryInput: null,
        subcategoryInput: null,
        titleInput: null,
        urlInput: null
    },

    /**
     * 初始化，缓存DOM元素并绑定事件
     */
    init() {
        this.elements.modal = document.getElementById('addModal');
        this.elements.categoryInput = document.getElementById('categoryInput');
        this.elements.subcategoryInput = document.getElementById('subcategoryInput');
        this.elements.titleInput = document.getElementById('titleInput');
        this.elements.urlInput = document.getElementById('urlInput');

        this.bindEvents();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 分类输入变化时更新子分类列表
        this.elements.categoryInput.oninput = () => {
            const category = this.elements.categoryInput.value;
            Render.updateSubcategoryDatalist(category);
        };

        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === this.elements.modal) {
                this.close();
            }
        });
    },

    /**
     * 显示新增书签弹窗
     */
    show() {
        this.elements.modal.style.display = 'block';
        Render.updateDatalist();

        // 移动端禁止页面滚动
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * 关闭弹窗
     */
    close() {
        this.elements.modal.style.display = 'none';
        this.clearForm();

        // 移动端恢复页面滚动
        if (window.innerWidth <= 768) {
            document.body.style.overflow = '';
        }
    },

    /**
     * 清空表单
     */
    clearForm() {
        this.elements.categoryInput.value = '';
        this.elements.subcategoryInput.value = '';
        this.elements.titleInput.value = '';
        this.elements.urlInput.value = '';
    },

    /**
     * 获取表单数据
     * @returns {Object|null} 表单数据，验证失败返回null
     */
    getFormData() {
        const category = this.elements.categoryInput.value.trim();
        const subcategory = this.elements.subcategoryInput.value.trim();
        const title = this.elements.titleInput.value.trim();
        const url = this.elements.urlInput.value.trim();

        // 验证必填字段
        if (!category || !subcategory || !title || !url) {
            Toast.show('请填写所有字段', 'error');
            return null;
        }

        // 验证URL格式
        try {
            new URL(url);
        } catch (e) {
            Toast.show('请输入有效的URL', 'error');
            return null;
        }

        return { category, subcategory, title, url };
    }
};
