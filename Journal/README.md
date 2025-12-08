# Journal - 模块化日记本前端

一个教科书风格的个人日记本前端应用，支持富文本编辑、媒体插入、JSON导入导出等功能。

## 项目结构

```
journal/
├── index.html          # 主入口HTML文件
├── README.md           # 项目说明文档
├── css/                # 样式模块
│   ├── main.css        # 样式入口（导入所有模块）
│   ├── base.css        # 基础样式、CSS变量、重置样式
│   ├── cover.css       # 封面页样式
│   ├── toc.css         # 目录页样式
│   ├── chapter.css     # 章节页样式
│   ├── content.css     # 正文内容页样式
│   ├── components.css  # 组件样式（引用框、概念框、图表等）
│   ├── toolbar.css     # 工具栏样式
│   ├── dialog.css      # 对话框样式
│   └── responsive.css  # 响应式和打印样式
└── js/                 # JavaScript模块
    ├── app.js          # 应用主入口，初始化和全局API
    ├── state.js        # 全局状态管理
    ├── utils.js        # DOM工具和通用函数
    ├── storage.js      # 本地存储、JSON导入导出
    ├── dialog.js       # 对话框管理
    ├── media.js        # 媒体插入和拖放
    ├── toc.js          # 目录生成和更新
    ├── chapter.js      # 章节管理
    ├── entry.js        # 日记条目管理
    ├── cover.js        # 封面管理
    ├── layout.js       # 布局切换
    └── shortcuts.js    # 快捷键管理
```

## 模块说明

### CSS模块

| 模块 | 职责 |
|------|------|
| `base.css` | CSS变量定义、重置样式、书籍容器、可编辑区域、加载动画 |
| `cover.css` | 封面页布局、封面图片、标题、作者信息 |
| `toc.css` | 目录页布局、目录条目样式 |
| `chapter.css` | 章节分隔页样式 |
| `content.css` | 正文页布局、日记条目、页眉页脚、参考文献 |
| `components.css` | 引用框、概念框、侧边笔记、图表、表格、公式 |
| `toolbar.css` | 固定工具栏样式 |
| `dialog.css` | 对话框、遮罩层、表单元素 |
| `responsive.css` | 移动端适配、打印样式 |

### JavaScript模块

| 模块 | 职责 | 依赖 |
|------|------|------|
| `state.js` | 全局状态管理，提供get/set/subscribe | 无 |
| `utils.js` | DOM操作、日期格式化、防抖等工具函数 | 无 |
| `storage.js` | 本地存储、JSON导入导出 | state, utils |
| `dialog.js` | 媒体对话框、元数据对话框管理 | state, utils |
| `media.js` | 图片/视频插入、拖放功能 | state, utils, dialog, storage |
| `toc.js` | 目录生成和更新 | utils |
| `chapter.js` | 章节创建 | utils, toc |
| `entry.js` | 日记条目创建、组件插入 | state, utils, toc |
| `cover.js` | 封面图片设置 | utils, storage |
| `layout.js` | 单双栏布局切换 | utils |
| `shortcuts.js` | 键盘快捷键 | storage, entry |
| `app.js` | 应用初始化、全局函数绑定 | 所有模块 |

## 功能特性

- **富文本编辑**: 支持直接在页面上编辑内容
- **媒体插入**: 支持插入图片、视频，可选择尺寸
- **组件插入**: 引用框、概念框、侧边笔记
- **章节管理**: 创建新章节，自动更新目录
- **布局切换**: 单栏/双栏布局切换
- **数据持久化**: 自动保存到本地存储
- **JSON导入导出**: 支持数据备份和恢复
- **拖放支持**: 拖放图片到封面或内容区
- **快捷键**: Ctrl+S保存、Ctrl+O打开、Ctrl+N新建

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 导出JSON |
| `Ctrl/Cmd + O` | 导入JSON |
| `Ctrl/Cmd + N` | 新建日记条目 |

## 使用方法

1. 直接在浏览器中打开 `index.html`
2. 使用右上角工具栏进行编辑操作
3. 双击封面区域可更换封面图片
4. 点击日记内容区域后可使用组件插入功能

## 扩展开发

### 添加新的CSS模块

1. 在 `css/` 目录下创建新的CSS文件
2. 在 `css/main.css` 中添加 `@import` 语句

### 添加新的JS模块

1. 在 `js/` 目录下创建新的JS文件
2. 使用IIFE模式封装模块
3. 在 `index.html` 中按依赖顺序添加 `<script>` 标签
4. 如需全局访问，在 `app.js` 中注册

### 模块开发规范

```javascript
const ModuleName = (function() {
    // 私有变量和函数
    
    // 公开API
    return {
        publicMethod1,
        publicMethod2
    };
})();
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
