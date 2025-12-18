# PaperNotes - 论文阅读笔记工具

一个用于记录论文阅读笔记和学习笔记的Web应用，支持LaTeX公式渲染和Markdown格式。

## 特性

- 📚 **分类管理** - AI/ML领域的7大类38个子领域分类体系
- 📝 **Markdown支持** - 标题、列表、粗体、斜体、代码块
- 🔢 **LaTeX公式** - 行内公式 `$...$` 和块级公式 `$$...$$`
- 🛠️ **工具栏** - 常用数学符号和公式模板快捷插入
- 💾 **本地存储** - 数据自动保存到浏览器localStorage
- 📤 **导入导出** - JSON格式数据备份和恢复

## 项目结构

```
PaperNotes/
├── index.html          # 主入口文件
├── css/
│   └── styles.css      # 所有样式
├── js/
│   ├── config.js       # MathJax配置 & 分类结构
│   ├── state.js        # 状态管理
│   ├── storage.js      # 数据存储操作
│   ├── markdown.js     # Markdown解析器
│   ├── ui.js           # UI工具函数
│   ├── render.js       # 页面渲染
│   ├── toolbar.js      # 工具栏数据
│   └── app.js          # 主应用逻辑
├── paper.html          # [旧版] 原始单文件版本(备份)
└── README.md           # 本文件
```

## 使用方法

### 本地运行

1. 启动本地服务器（任选其一）：
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Node.js (需要安装serve)
   npx serve -p 8080
   ```

2. 打开浏览器访问 `http://localhost:8080`

### 功能说明

1. **浏览分类** - 点击分类卡片进入子分类
2. **添加笔记** - 在子分类页面点击"+ 添加论文"
3. **编辑笔记** - 点击论文进入详情，使用"编辑笔记"按钮
4. **数学公式** - 编辑时左右侧栏提供常用符号和模板
5. **搜索** - 在论文列表页面使用搜索框筛选

## 模块说明

| 模块 | 职责 |
|------|------|
| `config.js` | MathJax配置、宏定义、分类数据结构 |
| `state.js` | 应用状态管理（当前路径、论文数据） |
| `storage.js` | localStorage存取、导入导出 |
| `markdown.js` | Markdown转HTML、公式保护 |
| `ui.js` | DOM操作、模态框、侧边栏 |
| `render.js` | 页面渲染函数 |
| `toolbar.js` | 工具栏按钮数据和HTML生成 |
| `app.js` | 初始化、事件绑定、导航操作 |

## 数据格式

论文数据以JSON格式存储：

```json
{
  "分类名称": [
    {
      "title": "论文标题",
      "authors": "作者",
      "year": 2024,
      "url": "https://...",
      "summary": "一句话简介",
      "notes": "Markdown格式的笔记内容"
    }
  ]
}
```

## 技术栈

- 原生JavaScript (ES6+)
- MathJax 3.x (公式渲染)
- localStorage (数据持久化)
- Ghibli风格配色方案

## 更新日志

### v2.0 (重构版)
- 模块化设计，拆分为8个独立JS文件
- 修复Markdown解析器的列表处理bug
- 简化工具栏HTML生成（数据驱动）
- 消除重复代码
- 更好的错误处理

### v1.0 (原始版)
- 单HTML文件 (~2000行)
- 基础功能完整
