# MusicPlayer 模块化重构版

一个现代化的网页音乐播放器，具有磁带机风格的 UI 和丰富的音频可视化效果。

## 项目结构

```
music_player/
├── index.html              # 主入口文件
├── README.md               # 项目说明
├── css/                    # 样式模块
│   ├── variables.css       # CSS 变量（主题配置）
│   ├── base.css            # 基础样式和重置
│   ├── background.css      # 背景动画样式
│   ├── header.css          # 头部样式
│   ├── player.css          # 播放器面板样式
│   ├── cassette.css        # 磁带机样式
│   ├── controls.css        # 控制按钮样式
│   ├── visualizer.css      # 可视化（波形/VU表）样式
│   └── playlist.css        # 播放列表样式
└── js/                     # JavaScript 模块
    ├── app.js              # 主应用（协调各模块）
    └── modules/            # 功能模块
        ├── config.js       # 配置常量
        ├── eventBus.js     # 事件总线（模块通信）
        ├── audioEngine.js  # 音频引擎（Web Audio API）
        ├── playlistManager.js  # 播放列表管理
        ├── visualizer.js   # 音频可视化
        ├── uiController.js # UI 控制器
        ├── background.js   # 背景动画
        └── keyboard.js     # 键盘快捷键
```

## 模块说明

### CSS 模块
- **variables.css**: 定义所有 CSS 变量，方便主题定制
- **base.css**: 基础重置和通用样式
- **background.css**: 动态背景动画
- **header.css**: 顶部区域样式
- **player.css**: 播放器主面板
- **cassette.css**: 磁带机视觉效果
- **controls.css**: 各种控制按钮
- **visualizer.css**: 波形和 VU 表
- **playlist.css**: 歌曲列表

### JS 模块
- **config.js**: 集中管理配置项（音效预设、循环模式等）
- **eventBus.js**: 发布/订阅模式的事件总线，解耦各模块
- **audioEngine.js**: 封装 Web Audio API，处理音频播放和均衡器
- **playlistManager.js**: 管理歌曲列表、搜索过滤、循环模式
- **visualizer.js**: 音频波形和 VU 表可视化
- **uiController.js**: 处理所有 UI 渲染和交互
- **background.js**: 背景动画效果
- **keyboard.js**: 键盘快捷键支持

## 使用方式

### 方式一：本地服务器（推荐）
```bash
# 在 music_player 目录下启动服务器
python -m http.server 8080

# 然后在浏览器打开
http://localhost:8080
```

### 方式二：直接双击打开
直接双击 `index.html` 文件即可打开。由于浏览器安全限制，此模式下无法自动加载 `music.json` 或 `music.txt`，但可以通过**拖放或选择本地音乐文件**来播放。

## 音乐文件配置

### 多播放列表支持

你可以创建多个 JSON 文件来管理不同类型的音乐：

```
music_player/
├── music.json      # 默认播放列表
├── classical.json  # 古典音乐
├── pop.json        # 流行音乐
├── rock.json       # 摇滚音乐
└── ...
```

在播放器中，点击"列表"按钮打开下拉菜单，然后点击"音乐列表"标题旁边的选择器即可切换不同的播放列表。

### 播放列表 JSON 格式
```json
{
    "musicList": [
        {
            "name": "歌曲名称.mp3",
            "path": "music/歌曲名称.mp3",
            "size": "5.2",
            "duration": "3:45"
        }
    ]
}
```

### 使用 music.txt（兼容模式）
每行一个音乐文件路径：
```
music/song1.mp3
music/song2.mp3
```

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| 空格 | 播放/暂停 |
| ← | 上一首 |
| → | 下一首 |
| ↑ | 增加音量 |
| ↓ | 减少音量 |
| L | 切换循环模式 |

## 功能特性

- 🎵 磁带机风格 UI
- 📊 实时音频波形可视化
- 📈 双通道 VU 表
- 🎛️ 10 种均衡器预设
- 🔀 列表循环/单曲循环/随机播放
- 🔍 歌曲搜索过滤
- ⌨️ 键盘快捷键
- 📁 支持本地文件拖放
- 📱 虚拟滚动（支持大量歌曲）

## 浏览器兼容性

- Chrome 66+
- Firefox 60+
- Safari 11+
- Edge 79+

需要支持 ES6 模块和 Web Audio API。
