/**
 * 播放列表管理模块
 * 负责歌曲列表的加载、过滤、管理
 */

import { CONFIG } from './config.js';
import { eventBus, EVENTS } from './eventBus.js';

class PlaylistManager {
    constructor() {
        this.musicList = [];
        this.filteredList = [];
        this.currentIndex = -1;
        this.loopMode = CONFIG.loopModes.LIST;
        this.isLocalMode = false; // 是否为本地文件模式
        
        // 播放列表源管理
        this.currentSource = 'music'; // 当前播放列表源名称（不含.json）
        this.availableSources = ['music']; // 可用的播放列表源
    }

    /**
     * 加载音乐列表
     * @param {string} sourceName - 播放列表源名称（不含.json），默认为 'music'
     */
    async loadMusicList(sourceName = null) {
        try {
            // 检测是否为 file:// 协议
            this.isLocalMode = window.location.protocol === 'file:';
            
            if (this.isLocalMode) {
                // 本地模式：显示文件选择提示
                console.log('本地模式：请选择音乐文件');
                this.musicList = [];
                this.filteredList = [];
                eventBus.emit(EVENTS.PLAYLIST_LOADED, { 
                    list: this.filteredList,
                    isLocalMode: true 
                });
                return;
            }

            // 首次加载时扫描可用的播放列表
            if (sourceName === null) {
                await this.scanAvailableSources();
                sourceName = this.currentSource;
            }

            // 加载指定的 JSON 文件
            const jsonFile = `${sourceName}.json`;
            const response = await fetch(jsonFile);
            
            if (response.ok) {
                const data = await response.json();
                this.musicList = data.musicList || [];
                this.currentSource = sourceName;
            } else {
                // 尝试加载 music.txt 作为后备
                const txtResponse = await fetch('music.txt');
                if (txtResponse.ok) {
                    const text = await txtResponse.text();
                    const lines = text.split('\n').filter(line => line.trim());
                    this.musicList = lines.map((name) => ({
                        name: name.trim(),
                        path: name.trim(),
                        size: 0,
                        duration: '--:--'
                    }));
                    this.currentSource = 'music';
                } else {
                    // 使用演示数据
                    this.musicList = this.generateDemoData();
                    this.currentSource = 'demo';
                }
            }

            this.filteredList = [...this.musicList];
            this.currentIndex = -1;
            
            eventBus.emit(EVENTS.PLAYLIST_LOADED, { 
                list: this.filteredList,
                isLocalMode: false 
            });
            
            eventBus.emit(EVENTS.PLAYLIST_SOURCE_CHANGE, {
                source: this.currentSource,
                availableSources: this.availableSources
            });

        } catch (error) {
            console.error('加载音乐列表失败:', error);
            this.musicList = this.generateDemoData();
            this.filteredList = [...this.musicList];
            this.currentSource = 'demo';
            eventBus.emit(EVENTS.PLAYLIST_LOADED, { 
                list: this.filteredList,
                isLocalMode: false 
            });
        }
    }

    /**
     * 扫描可用的播放列表源
     */
    async scanAvailableSources() {
        try {
            // 从服务器 API 获取可用的播放列表
            const response = await fetch('/api/playlists');
            if (response.ok) {
                const data = await response.json();
                this.availableSources = data.playlists || ['music'];
            } else {
                // API 失败时回退到默认
                this.availableSources = ['music'];
            }
        } catch (e) {
            console.warn('获取播放列表失败，使用默认值:', e);
            this.availableSources = ['music'];
        }
        
        // 确保至少有 'music' 作为默认选项
        if (this.availableSources.length === 0) {
            this.availableSources = ['music'];
        }
        
        // 如果当前源不在可用列表中，切换到第一个可用源
        if (!this.availableSources.includes(this.currentSource)) {
            this.currentSource = this.availableSources[0];
        }
        
        eventBus.emit(EVENTS.PLAYLIST_SOURCES_LOADED, {
            sources: this.availableSources,
            current: this.currentSource
        });
    }

    /**
     * 切换播放列表源
     * @param {string} sourceName - 播放列表源名称
     */
    async switchSource(sourceName) {
        if (sourceName === this.currentSource) return;
        
        console.log(`切换播放列表: ${this.currentSource} -> ${sourceName}`);
        await this.loadMusicList(sourceName);
    }

    /**
     * 获取当前播放列表源信息
     */
    getSourceInfo() {
        return {
            current: this.currentSource,
            available: this.availableSources
        };
    }

    /**
     * 添加本地文件
     * @param {FileList} files - 文件列表
     */
    addLocalFiles(files) {
        const audioFiles = Array.from(files).filter(file => 
            file.type.startsWith('audio/') || 
            /\.(mp3|wav|ogg|flac|m4a|aac)$/i.test(file.name)
        );

        const newSongs = audioFiles.map(file => ({
            name: file.name,
            path: URL.createObjectURL(file),
            size: (file.size / (1024 * 1024)).toFixed(1),
            duration: '--:--',
            isLocal: true,
            file: file
        }));

        this.musicList = [...this.musicList, ...newSongs];
        this.filteredList = [...this.musicList];
        
        eventBus.emit(EVENTS.FILES_SELECTED, { 
            count: newSongs.length,
            total: this.musicList.length 
        });
        eventBus.emit(EVENTS.PLAYLIST_LOADED, { 
            list: this.filteredList,
            isLocalMode: this.isLocalMode 
        });
    }

    /**
     * 清空播放列表
     */
    clearPlaylist() {
        // 释放 Blob URLs
        this.musicList.forEach(song => {
            if (song.isLocal && song.path.startsWith('blob:')) {
                URL.revokeObjectURL(song.path);
            }
        });
        
        this.musicList = [];
        this.filteredList = [];
        this.currentIndex = -1;
        
        eventBus.emit(EVENTS.PLAYLIST_LOADED, { 
            list: this.filteredList,
            isLocalMode: this.isLocalMode 
        });
    }

    /**
     * 生成演示数据
     */
    generateDemoData() {
        const songs = [];
        for (let i = 1; i <= 50; i++) {
            songs.push({
                name: `${CONFIG.demoArtists[i % CONFIG.demoArtists.length]} - 歌曲 ${i}.mp3`,
                path: `demo_${i}.mp3`,
                size: (Math.random() * 10 + 3).toFixed(1),
                duration: `${Math.floor(Math.random() * 5 + 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
            });
        }
        return songs;
    }

    /**
     * 搜索过滤
     * @param {string} query - 搜索关键词
     */
    filter(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredList = this.musicList.filter(song =>
            song.name.toLowerCase().includes(lowerQuery)
        );
        this.currentIndex = -1;
        eventBus.emit(EVENTS.PLAYLIST_FILTERED, { list: this.filteredList });
    }

    /**
     * 获取当前歌曲
     */
    getCurrentSong() {
        if (this.currentIndex >= 0 && this.currentIndex < this.filteredList.length) {
            return this.filteredList[this.currentIndex];
        }
        return null;
    }

    /**
     * 设置当前索引
     * @param {number} index - 索引
     */
    setCurrentIndex(index) {
        if (index >= 0 && index < this.filteredList.length) {
            this.currentIndex = index;
            eventBus.emit(EVENTS.SONG_CHANGE, {
                song: this.filteredList[index],
                index: index
            });
            return this.filteredList[index];
        }
        return null;
    }

    /**
     * 获取下一首歌曲索引
     */
    getNextIndex() {
        if (this.filteredList.length === 0) return -1;

        switch (this.loopMode) {
            case CONFIG.loopModes.SINGLE:
                return this.currentIndex;
            case CONFIG.loopModes.RANDOM:
                return Math.floor(Math.random() * this.filteredList.length);
            case CONFIG.loopModes.LIST:
            default:
                return (this.currentIndex + 1) % this.filteredList.length;
        }
    }

    /**
     * 获取上一首歌曲索引
     */
    getPrevIndex() {
        if (this.filteredList.length === 0) return -1;

        switch (this.loopMode) {
            case CONFIG.loopModes.SINGLE:
                return this.currentIndex;
            case CONFIG.loopModes.RANDOM:
                return Math.floor(Math.random() * this.filteredList.length);
            case CONFIG.loopModes.LIST:
            default:
                return (this.currentIndex - 1 + this.filteredList.length) % this.filteredList.length;
        }
    }

    /**
     * 切换循环模式
     */
    toggleLoopMode() {
        const modes = Object.values(CONFIG.loopModes);
        const currentModeIndex = modes.indexOf(this.loopMode);
        this.loopMode = modes[(currentModeIndex + 1) % modes.length];
        
        eventBus.emit(EVENTS.LOOP_MODE_CHANGE, { mode: this.loopMode });
        return this.loopMode;
    }

    /**
     * 设置循环模式
     * @param {string} mode - 循环模式
     */
    setLoopMode(mode) {
        if (Object.values(CONFIG.loopModes).includes(mode)) {
            this.loopMode = mode;
            eventBus.emit(EVENTS.LOOP_MODE_CHANGE, { mode: this.loopMode });
        }
    }

    /**
     * 获取列表信息
     */
    getInfo() {
        return {
            total: this.musicList.length,
            filtered: this.filteredList.length,
            currentIndex: this.currentIndex,
            loopMode: this.loopMode,
            isLocalMode: this.isLocalMode
        };
    }

    /**
     * 获取过滤后的列表
     */
    getFilteredList() {
        return this.filteredList;
    }
}

// 导出单例
export const playlistManager = new PlaylistManager();
