/**
 * 主应用模块 - 协调各模块工作
 */

import { CONFIG } from './modules/config.js';
import { eventBus, EVENTS } from './modules/eventBus.js';
import { audioEngine } from './modules/audioEngine.js';
import { playlistManager } from './modules/playlistManager.js';
import { visualizer } from './modules/visualizer.js';
import { uiController } from './modules/uiController.js';
import { backgroundAnimation } from './modules/background.js';
import { keyboardController } from './modules/keyboard.js';

class MusicPlayerApp {
    constructor() {
        this.isPlaying = false;
    }

    /**
     * 初始化应用
     */
    async init() {
        console.log('MusicPlayer 初始化中...');

        // 初始化各模块
        this.initModules();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 加载音乐列表
        await playlistManager.loadMusicList();

        console.log('MusicPlayer 初始化完成');
    }

    /**
     * 初始化各模块
     */
    initModules() {
        // 初始化音频引擎
        const audioElement = document.getElementById('audioPlayer');
        audioEngine.init(audioElement);

        // 初始化 UI
        uiController.init();

        // 初始化可视化
        const waveformCanvas = document.getElementById('waveformCanvas');
        visualizer.initWaveform(waveformCanvas);
        visualizer.initVUMeters({
            canvasL: document.getElementById('vuCanvasL'),
            canvasR: document.getElementById('vuCanvasR'),
            needleL: document.getElementById('vuNeedleL'),
            needleR: document.getElementById('vuNeedleR')
        });
        visualizer.drawWaveform();

        // 初始化背景动画
        backgroundAnimation.init('bgAnimation');

        // 初始化键盘控制
        keyboardController.init();
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 播放列表加载完成
        eventBus.on(EVENTS.PLAYLIST_LOADED, ({ list, isLocalMode }) => {
            uiController.renderPlaylist(list, playlistManager.currentIndex, isLocalMode);
        });
        
        // 播放列表源加载完成
        eventBus.on(EVENTS.PLAYLIST_SOURCES_LOADED, ({ sources, current }) => {
            uiController.updatePlaylistSelector(sources, current);
        });
        
        // 播放列表源切换
        eventBus.on(EVENTS.PLAYLIST_SOURCE_CHANGE, ({ source, availableSources }) => {
            uiController.updatePlaylistSelector(availableSources, source);
        });
        
        // UI 切换播放列表源
        eventBus.on('ui:switchSource', ({ source }) => {
            playlistManager.switchSource(source);
        });

        // 播放列表过滤
        eventBus.on(EVENTS.PLAYLIST_FILTERED, ({ list }) => {
            uiController.resetScroll();
            uiController.renderPlaylist(list, playlistManager.currentIndex);
        });

        // UI 滚动
        eventBus.on('ui:scroll', () => {
            const list = playlistManager.getFilteredList();
            uiController.renderPlaylist(list, playlistManager.currentIndex);
        });
        
        // UI 搜索（已防抖）
        eventBus.on('ui:search', ({ query }) => {
            playlistManager.filter(query);
        });

        // 歌曲变化
        eventBus.on(EVENTS.SONG_CHANGE, ({ song }) => {
            uiController.updateSongTitle(song.name);
            const list = playlistManager.getFilteredList();
            uiController.renderPlaylist(list, playlistManager.currentIndex);
        });

        // 播放状态变化
        eventBus.on(EVENTS.PLAYING_STATE_CHANGE, ({ isPlaying }) => {
            this.isPlaying = isPlaying;
            uiController.updatePlayButton(isPlaying);
            visualizer.setPlaying(isPlaying);
        });

        // 进度更新
        eventBus.on(EVENTS.PROGRESS_UPDATE, ({ progress, currentTime, duration }) => {
            uiController.updateProgress(progress, currentTime, duration);
        });

        // 音效变化
        eventBus.on(EVENTS.EFFECT_CHANGE, ({ name }) => {
            uiController.updateEffectName(name);
        });

        // 循环模式变化
        eventBus.on(EVENTS.LOOP_MODE_CHANGE, ({ mode }) => {
            uiController.updateLoopButton(mode);
        });

        // 自动播放下一首
        eventBus.on(EVENTS.NEXT, ({ auto }) => {
            if (auto && playlistManager.loopMode === CONFIG.loopModes.SINGLE) {
                audioEngine.play();
            } else {
                this.playNext();
            }
        });

        // 文件选择
        eventBus.on(EVENTS.FILES_SELECTED, ({ files }) => {
            if (files) {
                playlistManager.addLocalFiles(files);
            }
        });

        // 键盘事件
        eventBus.on('keyboard:playToggle', () => this.togglePlay());
        eventBus.on('keyboard:prev', () => this.playPrev());
        eventBus.on('keyboard:next', () => this.playNext());
        eventBus.on('keyboard:volumeUp', () => this.adjustVolume(10));
        eventBus.on('keyboard:volumeDown', () => this.adjustVolume(-10));
        eventBus.on('keyboard:loopToggle', () => playlistManager.toggleLoopMode());

        // 绑定 UI 按钮事件
        this.bindUIEvents();

        // 窗口大小变化
        window.addEventListener('resize', () => {
            visualizer.handleResize();
        });
    }

    /**
     * 绑定 UI 按钮事件
     */
    bindUIEvents() {
        const ui = uiController;

        // 播放按钮
        ui.getElement('playBtn')?.addEventListener('click', () => this.togglePlay());

        // 上一首/下一首
        ui.getElement('prevBtn')?.addEventListener('click', () => this.playPrev());
        ui.getElement('nextBtn')?.addEventListener('click', () => this.playNext());

        // 快进/快退
        ui.getElement('rewindBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            audioEngine.rewind();
        });
        ui.getElement('forwardBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            audioEngine.forward();
        });

        // 循环模式
        ui.getElement('loopBtn')?.addEventListener('click', () => {
            playlistManager.toggleLoopMode();
        });

        // 随机播放
        ui.getElement('shuffleBtn')?.addEventListener('click', () => {
            playlistManager.setLoopMode(CONFIG.loopModes.RANDOM);
            this.playNext();
        });

        // 音效切换
        ui.getElement('effectPrevBtn')?.addEventListener('click', () => {
            audioEngine.prevEffect();
        });
        ui.getElement('effectNextBtn')?.addEventListener('click', () => {
            audioEngine.nextEffect();
        });

        // 音量控制（点击灯带）
        const volumeBar = ui.getElement('volumeBar');
        const volumeFill = ui.getElement('volumeFill');
        if (volumeBar && volumeFill) {
            // 初始化音量显示
            volumeFill.style.width = (CONFIG.defaultVolume * 100) + '%';
            
            const updateVolume = (e) => {
                const rect = volumeBar.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                volumeFill.style.width = (pos * 100) + '%';
                audioEngine.setVolume(pos);
            };
            
            volumeBar.addEventListener('click', updateVolume);
            
            // 支持拖动
            let isDragging = false;
            volumeBar.addEventListener('mousedown', (e) => {
                isDragging = true;
                updateVolume(e);
            });
            document.addEventListener('mousemove', (e) => {
                if (isDragging) updateVolume(e);
            });
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        // 进度条点击
        const progressBar = ui.getElement('progressBar');
        if (progressBar) {
            let isDraggingProgress = false;
            
            const seekToPosition = (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pos = Math.max(0, Math.min(1, clickX / rect.width));
                const state = audioEngine.getState();
                console.log('Progress seek:', { clickX, width: rect.width, pos, duration: state.duration, seekTime: pos * state.duration });
                if (state.duration && state.duration > 0 && !isNaN(state.duration)) {
                    audioEngine.seek(pos * state.duration);
                }
            };
            
            progressBar.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isDraggingProgress = true;
                seekToPosition(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDraggingProgress) {
                    seekToPosition(e);
                }
            });
            
            document.addEventListener('mouseup', () => {
                isDraggingProgress = false;
            });
        }

        // 搜索事件已在 uiController 中处理（带防抖）

        // 播放列表点击
        const playlistContent = ui.getElement('playlistContent');
        if (playlistContent) {
            playlistContent.addEventListener('click', (e) => {
                const item = e.target.closest('.song-item');
                if (item) {
                    const index = parseInt(item.dataset.index);
                    this.playSong(index);
                }
            });
        }
    }

    /**
     * 播放指定歌曲
     * @param {number} index - 歌曲索引
     */
    async playSong(index) {
        const song = playlistManager.setCurrentIndex(index);
        if (!song) return;

        const success = await audioEngine.play(song.path);
        if (!success) {
            uiController.showError(
                '无法播放此音频文件。\n\n请确保:\n1. 音频文件存在于正确路径\n2. 已配置本地服务器（或使用本地文件选择）\n3. 文件格式被浏览器支持'
            );
        }
    }

    /**
     * 切换播放/暂停
     */
    togglePlay() {
        if (playlistManager.currentIndex === -1) {
            const list = playlistManager.getFilteredList();
            if (list.length > 0) {
                this.playSong(0);
            }
        } else {
            audioEngine.togglePlay();
        }
    }

    /**
     * 播放下一首
     */
    playNext() {
        const nextIndex = playlistManager.getNextIndex();
        if (nextIndex >= 0) {
            this.playSong(nextIndex);
        }
    }

    /**
     * 播放上一首
     */
    playPrev() {
        const prevIndex = playlistManager.getPrevIndex();
        if (prevIndex >= 0) {
            this.playSong(prevIndex);
        }
    }

    /**
     * 调整音量
     * @param {number} delta - 变化量（百分比）
     */
    adjustVolume(delta) {
        const volumeFill = uiController.getElement('volumeFill');
        if (volumeFill) {
            const currentWidth = parseFloat(volumeFill.style.width) || 70;
            const newValue = Math.max(0, Math.min(100, currentWidth + delta));
            volumeFill.style.width = newValue + '%';
            audioEngine.setVolume(newValue / 100);
        }
    }
}

// 创建应用实例并初始化
const app = new MusicPlayerApp();

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export { app };
