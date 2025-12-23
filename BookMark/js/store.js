/**
 * store.js - 数据状态管理模块
 * 职责：管理书签数据、状态、localStorage读写
 */

const Store = {
    // 版本号，数据结构变更时更新
    VERSION: '2.0',
    STORAGE_KEY: 'bookmarksData',
    VERSION_KEY: 'bookmarksVersion',

    // 数据状态
    data: {
        categories: {}
    },

    // 当前选中状态
    currentCategory: null,
    currentSubcategory: null,

    /**
     * 初始化数据
     */
    init() {
        this.load();
    },

    /**
     * 从 localStorage 加载数据
     */
    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const version = localStorage.getItem(this.VERSION_KEY);

        if (saved && version === this.VERSION) {
            this.data = JSON.parse(saved);
        } else {
            this.initDefaultData();
            localStorage.setItem(this.VERSION_KEY, this.VERSION);
            this.save();
        }
    },

    /**
     * 保存数据到 localStorage
     */
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    },

    /**
     * 重置为默认数据
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.VERSION_KEY);
        this.initDefaultData();
        this.save();
        this.currentCategory = null;
        this.currentSubcategory = null;
    },

    /**
     * 导入数据
     * @param {Object} importedData - 导入的数据对象
     * @returns {boolean} 是否成功
     */
    import(importedData) {
        if (importedData && importedData.categories) {
            this.data = importedData;
            this.save();
            this.currentCategory = null;
            this.currentSubcategory = null;
            return true;
        }
        return false;
    },

    /**
     * 导出数据
     * @returns {string} JSON字符串
     */
    export() {
        return JSON.stringify(this.data, null, 2);
    },

    /**
     * 获取所有分类名
     * @returns {string[]}
     */
    getCategories() {
        return Object.keys(this.data.categories);
    },

    /**
     * 获取指定分类下的所有子分类
     * @param {string} category
     * @returns {string[]}
     */
    getSubcategories(category) {
        if (!this.data.categories[category]) return [];
        return Object.keys(this.data.categories[category]);
    },

    /**
     * 获取指定分类的书签总数
     * @param {string} category
     * @returns {number}
     */
    getCategoryCount(category) {
        if (!this.data.categories[category]) return 0;
        return Object.values(this.data.categories[category])
            .reduce((sum, bookmarks) => sum + bookmarks.length, 0);
    },

    /**
     * 获取指定子分类的书签数量
     * @param {string} category
     * @param {string} subcategory
     * @returns {number}
     */
    getSubcategoryCount(category, subcategory) {
        if (!this.data.categories[category]?.[subcategory]) return 0;
        return this.data.categories[category][subcategory].length;
    },

    /**
     * 获取指定子分类的所有书签
     * @param {string} category
     * @param {string} subcategory
     * @returns {Array}
     */
    getBookmarks(category, subcategory) {
        return this.data.categories[category]?.[subcategory] || [];
    },

    /**
     * 添加书签
     * @param {string} category
     * @param {string} subcategory
     * @param {string} title
     * @param {string} url
     */
    addBookmark(category, subcategory, title, url) {
        // 初始化分类结构
        if (!this.data.categories[category]) {
            this.data.categories[category] = {};
        }
        if (!this.data.categories[category][subcategory]) {
            this.data.categories[category][subcategory] = [];
        }

        this.data.categories[category][subcategory].push({ title, url });
        this.save();
    },

    /**
     * 删除书签
     * @param {number} index - 书签在当前子分类中的索引
     * @returns {boolean} 是否需要更新分类选择
     */
    deleteBookmark(index) {
        if (!this.currentCategory || !this.currentSubcategory) return false;

        const bookmarks = this.data.categories[this.currentCategory][this.currentSubcategory];
        bookmarks.splice(index, 1);

        let needUpdateSelection = false;

        // 如果小类为空，删除小类
        if (bookmarks.length === 0) {
            delete this.data.categories[this.currentCategory][this.currentSubcategory];

            // 如果大类为空，删除大类
            if (Object.keys(this.data.categories[this.currentCategory]).length === 0) {
                delete this.data.categories[this.currentCategory];
                this.currentCategory = null;
                this.currentSubcategory = null;
            } else {
                this.currentSubcategory = null;
            }
            needUpdateSelection = true;
        }

        this.save();
        return needUpdateSelection;
    },

    /**
     * 选择分类
     * @param {string} category
     */
    selectCategory(category) {
        this.currentCategory = category;
        this.currentSubcategory = null;
    },

    /**
     * 选择子分类
     * @param {string} subcategory
     */
    selectSubcategory(subcategory) {
        this.currentSubcategory = subcategory;
    },

    /**
     * 初始化默认数据
     */
    initDefaultData() {
        this.data = {
            categories: {
                "在线课程": {
                    "机器学习": [
                        { title: "Stanford-CS231n-计算机视觉", url: "http://cs231n.stanford.edu/" }
                    ],
                    "深度学习": [
                        { title: "MIT-6.S191-深度学习导论", url: "http://introtodeeplearning.com/" }
                    ],
                    "优化理论": [
                        { title: "Stanford-EE364a-凸优化", url: "https://web.stanford.edu/class/ee364a/" }
                    ],
                    "微积分": [
                        { title: "MIT-18.01-单变量微积分", url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" }
                    ],
                    "线性代数": [
                        { title: "MIT-18.06-线性代数", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" }
                    ],
                    "概率统计": [
                        { title: "MIT-6.041-概率论导论", url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/" }
                    ],
                    "计算机视觉": [
                        { title: "Stanford-CS231n-CNN视觉识别", url: "http://cs231n.stanford.edu/" }
                    ],
                    "自然语言处理": [
                        { title: "Stanford-CS224n-深度学习NLP", url: "http://web.stanford.edu/class/cs224n/" }
                    ],
                    "强化学习": [
                        { title: "UCB-CS285-深度强化学习", url: "http://rail.eecs.berkeley.edu/deeprlcourse/" }
                    ],
                    "算法与数据结构": [
                        { title: "MIT-6.006-算法导论", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" }
                    ],
                    "数据库系统": [
                        { title: "CMU-15-445-数据库系统", url: "https://15445.courses.cs.cmu.edu/" }
                    ],
                    "操作系统": [
                        { title: "MIT-6.828-操作系统工程", url: "https://pdos.csail.mit.edu/6.828/" }
                    ],
                    "计算机网络": [
                        { title: "Stanford-CS144-计算机网络", url: "https://cs144.github.io/" }
                    ],
                    "编译原理": [
                        { title: "Stanford-CS143-编译器", url: "http://web.stanford.edu/class/cs143/" }
                    ],
                    "分布式系统": [
                        { title: "MIT-6.824-分布式系统", url: "https://pdos.csail.mit.edu/6.824/" }
                    ],
                    "计算机图形学": [
                        { title: "Stanford-CS248-交互式计算机图形学", url: "http://graphics.stanford.edu/courses/cs248-18-spring/" }
                    ],
                    "密码学": [
                        { title: "Stanford-CS255-密码学导论", url: "https://crypto.stanford.edu/~dabo/cs255/" }
                    ],
                    "量子计算": [
                        { title: "MIT-8.370x-量子计算基础", url: "https://learning.edx.org/course/course-v1:MITx+8.370.1x+1T2018" }
                    ],
                    "生物信息学": [
                        { title: "Stanford-CS273a-计算生物学", url: "https://web.stanford.edu/class/cs273a/" }
                    ],
                    "机器人学": [
                        { title: "MIT-6.834J-认知机器人学", url: "https://ocw.mit.edu/courses/6-834j-cognitive-robotics-spring-2016/" }
                    ],
                    "区块链技术": [
                        { title: "Princeton-比特币和加密货币技术", url: "https://www.coursera.org/learn/cryptocurrency" }
                    ],
                    "云计算": [
                        { title: "UIUC-云计算概念", url: "https://www.coursera.org/learn/cloud-computing" }
                    ],
                    "信息论": [
                        { title: "MIT-6.441-信息论", url: "https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/" }
                    ],
                    "计算神经科学": [
                        { title: "Coursera-计算神经科学", url: "https://www.coursera.org/learn/computational-neuroscience" }
                    ],
                    "数据挖掘": [
                        { title: "Stanford-CS246-大规模数据挖掘", url: "http://web.stanford.edu/class/cs246/" }
                    ],
                    "游戏开发": [
                        { title: "MIT-CMS.611J-游戏设计", url: "https://ocw.mit.edu/courses/cms-611j-creating-video-games-fall-2013/" }
                    ],
                    "人工智能伦理": [
                        { title: "MIT-24.09x-AI伦理学", url: "https://www.edx.org/course/the-ethics-of-ai" }
                    ],
                    "计算机安全": [
                        { title: "Stanford-CS155-计算机和网络安全", url: "https://cs155.stanford.edu/" }
                    ],
                    "并行计算": [
                        { title: "CMU-15-418-并行计算机架构", url: "http://15418.courses.cs.cmu.edu/" }
                    ],
                    "软件工程": [
                        { title: "MIT-6.005-软件构造", url: "http://web.mit.edu/6.005/" }
                    ]
                },
                "GitHub仓库": {
                    "生成模型": [
                        { title: "Stable-Diffusion", url: "https://github.com/CompVis/stable-diffusion" }
                    ],
                    "深度学习框架": [
                        { title: "PyTorch", url: "https://github.com/pytorch/pytorch" }
                    ]
                },
                "技术文档": {
                    "前端框架": [
                        { title: "React-官方文档", url: "https://react.dev/" }
                    ]
                }
            }
        };
    }
};
