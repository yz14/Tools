/**
 * render.js - UI渲染模块
 * 职责：DOM元素的渲染和更新
 */

const Render = {
    // DOM元素缓存
    elements: {
        categoryList: null,
        subcategoryList: null,
        content: null,
        categoryDatalist: null,
        subcategoryDatalist: null
    },

    /**
     * 初始化，缓存DOM元素
     */
    init() {
        this.elements.categoryList = document.getElementById('categoryList');
        this.elements.subcategoryList = document.getElementById('subcategoryList');
        this.elements.content = document.getElementById('content');
        this.elements.categoryDatalist = document.getElementById('categoryDatalist');
        this.elements.subcategoryDatalist = document.getElementById('subcategoryDatalist');
    },

    /**
     * 渲染大类列表
     */
    renderCategories() {
        const { categoryList } = this.elements;
        categoryList.innerHTML = '';

        const categories = Store.getCategories();
        const isMobile = window.innerWidth <= 768;

        categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';

            if (category === Store.currentCategory) {
                item.classList.add('active');
            }

            const count = Store.getCategoryCount(category);
            item.innerHTML = `
                <span>${category}</span>
                <span class="item-count">${count}</span>
            `;

            item.onclick = () => {
                if (isMobile) {
                    App.selectCategoryMobile(category);
                } else {
                    App.selectCategory(category);
                }
            };

            categoryList.appendChild(item);
        });

        this.updateDatalist();
    },

    /**
     * 渲染小类列表
     */
    renderSubcategories() {
        const { subcategoryList } = this.elements;
        subcategoryList.innerHTML = '';

        if (!Store.currentCategory) return;

        const subcategories = Store.getSubcategories(Store.currentCategory);
        const isMobile = window.innerWidth <= 768;

        subcategories.forEach(subcategory => {
            const item = document.createElement('div');
            item.className = 'subcategory-item';

            if (subcategory === Store.currentSubcategory) {
                item.classList.add('active');
            }

            const count = Store.getSubcategoryCount(Store.currentCategory, subcategory);
            item.innerHTML = `
                <span>${subcategory}</span>
                <span class="item-count">${count}</span>
            `;

            item.onclick = () => {
                if (isMobile) {
                    App.selectSubcategoryMobile(subcategory);
                } else {
                    App.selectSubcategory(subcategory);
                }
            };

            subcategoryList.appendChild(item);
        });
    },

    /**
     * 渲染内容区域
     */
    renderContent() {
        const { content } = this.elements;

        // 未选择分类时显示空状态
        if (!Store.currentCategory || !Store.currentSubcategory) {
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h3>请选择分类</h3>
                    <p>${Store.currentCategory ? '请选择小类查看书签' : '请先选择大类'}</p>
                </div>
            `;
            return;
        }

        const bookmarks = Store.getBookmarks(Store.currentCategory, Store.currentSubcategory);

        // 无书签时显示空状态
        if (!bookmarks || bookmarks.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>暂无书签</h3>
                    <p>点击上方"新增书签"按钮添加第一个书签</p>
                </div>
            `;
            return;
        }

        // 渲染书签列表
        content.innerHTML = `
            <div class="content-header">
                <h2>${Store.currentCategory}/${Store.currentSubcategory} (${bookmarks.length})</h2>
            </div>
            <div class="bookmarks-grid" id="bookmarksGrid"></div>
        `;

        const grid = document.getElementById('bookmarksGrid');
        bookmarks.forEach((bookmark, index) => {
            const card = this.createBookmarkCard(bookmark, index);
            grid.appendChild(card);
        });
    },

    /**
     * 从URL提取域名
     * @param {string} url
     * @returns {string}
     */
    getDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return '';
        }
    },

    /**
     * 获取网站favicon URL
     * @param {string} url
     * @returns {string}
     */
    getFaviconUrl(url) {
        const domain = this.getDomain(url);
        // 使用Google的favicon服务
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    },

    /**
     * 创建书签卡片元素
     * @param {Object} bookmark - 书签对象
     * @param {number} index - 索引
     * @returns {HTMLElement}
     */
    createBookmarkCard(bookmark, index) {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        const domain = this.getDomain(bookmark.url);
        const faviconUrl = this.getFaviconUrl(bookmark.url);
        
        card.innerHTML = `
            <div class="bookmark-favicon">
                <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🔗</text></svg>'">
            </div>
            <div class="bookmark-info">
                <div class="bookmark-title">${bookmark.title}</div>
                <div class="bookmark-domain">${domain}</div>
            </div>
            <div class="bookmark-actions">
                <button class="btn-delete" data-index="${index}" title="删除">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;

        // 点击卡片打开链接
        card.onclick = (e) => {
            if (!e.target.closest('.btn-delete')) {
                window.open(bookmark.url, '_blank');
            }
        };

        // 删除按钮事件
        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            App.deleteBookmark(index);
        };

        return card;
    },

    /**
     * 更新表单数据列表（自动完成）
     */
    updateDatalist() {
        const { categoryDatalist } = this.elements;
        categoryDatalist.innerHTML = '';

        Store.getCategories().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            categoryDatalist.appendChild(option);
        });
    },

    /**
     * 更新子分类数据列表
     * @param {string} category
     */
    updateSubcategoryDatalist(category) {
        const { subcategoryDatalist } = this.elements;
        subcategoryDatalist.innerHTML = '';

        if (Store.data.categories[category]) {
            Store.getSubcategories(category).forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                subcategoryDatalist.appendChild(option);
            });
        }
    },

    /**
     * 渲染所有内容
     */
    renderAll() {
        this.renderCategories();
        this.renderSubcategories();
        this.renderContent();
    },

    /**
     * 渲染搜索结果
     * @param {string} query
     */
    renderSearchResults(query) {
        const { content } = this.elements;
        
        // 如果搜索框为空，恢复正常显示
        if (!query) {
            this.renderContent();
            return;
        }

        // 搜索所有书签
        const results = [];
        const categories = Store.data.categories;
        
        for (const category in categories) {
            for (const subcategory in categories[category]) {
                categories[category][subcategory].forEach((bookmark, index) => {
                    if (bookmark.title.toLowerCase().includes(query) ||
                        bookmark.url.toLowerCase().includes(query)) {
                        results.push({
                            ...bookmark,
                            category,
                            subcategory,
                            index
                        });
                    }
                });
            }
        }

        // 渲染搜索结果
        if (results.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>未找到匹配的书签</h3>
                    <p>尝试使用其他关键词搜索</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <div class="content-header">
                <h2>搜索结果 (${results.length})</h2>
            </div>
            <div class="bookmarks-grid" id="bookmarksGrid"></div>
        `;

        const grid = document.getElementById('bookmarksGrid');
        results.forEach((bookmark) => {
            const card = this.createSearchResultCard(bookmark);
            grid.appendChild(card);
        });
    },

    /**
     * 创建搜索结果卡片
     * @param {Object} bookmark
     * @returns {HTMLElement}
     */
    createSearchResultCard(bookmark) {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        const domain = this.getDomain(bookmark.url);
        const faviconUrl = this.getFaviconUrl(bookmark.url);
        
        card.innerHTML = `
            <div class="bookmark-favicon">
                <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🔗</text></svg>'">
            </div>
            <div class="bookmark-info">
                <div class="bookmark-title">${bookmark.title}</div>
                <div class="bookmark-meta">
                    <span class="bookmark-domain">${domain}</span>
                    <span class="bookmark-path">${bookmark.category} / ${bookmark.subcategory}</span>
                </div>
            </div>
        `;

        card.onclick = () => window.open(bookmark.url, '_blank');
        return card;
    }
};
