/**
 * UI 控制器模块 - 处理所有 UI 交互和渲染
 */

import { CONFIG, LOOP_ICONS, PLAY_ICONS } from './config.js';
import { eventBus, EVENTS } from './eventBus.js';

class UIController {
    constructor() {
        this.elements = {};
        this.scrollTop = 0;
        this.visibleCount = 0;
        
        // 性能优化：节流相关
        this._scrollThrottleId = null;
        this._lastScrollTime = 0;
        this._scrollThrottleInterval = 16; // ~60fps
        
        // 性能优化：DOM 池复用
        this._itemPool = [];
        this._activeItems = new Map();
        this._lastRenderState = null;
        
        // 性能优化：搜索防抖
        this._searchDebounceId = null;
        this._searchDebounceDelay = 150;
    }

    /**
     * 初始化 UI 元素引用
     */
    init() {
        this.elements = {
            // 播放控制
            playBtn: document.getElementById('playBtn'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            rewindBtn: document.getElementById('rewindBtn'),
            forwardBtn: document.getElementById('forwardBtn'),
            loopBtn: document.getElementById('cassetteLoopBtn'),
            shuffleBtn: document.getElementById('cassetteShuffleBtn'),
            
            // 音效
            effectPrevBtn: document.getElementById('effectPrevBtn'),
            effectNextBtn: document.getElementById('effectNextBtn'),
            effectName: document.getElementById('effectName'),
            
            // 进度和音量
            progressBar: document.getElementById('progressBar'),
            progressFill: document.getElementById('progressFill'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            volumeBar: document.getElementById('volumeBar'),
            volumeFill: document.getElementById('volumeFill'),
            
            // 播放列表
            playlistContent: document.getElementById('playlistContent'),
            searchInput: document.getElementById('searchInput'),
            songCount: document.getElementById('songCount'),
            
            // 显示
            albumArt: document.getElementById('albumArt'),
            currentSongTitle: document.getElementById('currentSongTitle'),
            cassetteLabel: document.querySelector('.cassette-label'),
            
            // 文件选择
            fileInput: document.getElementById('fileInput'),
            fileDropZone: document.getElementById('fileDropZone'),
            
            // 下拉列表
            playlistToggleBtn: document.getElementById('playlistToggleBtn'),
            playlistDropdown: document.getElementById('playlistDropdown'),
            
            // 播放列表选择器
            playlistSelectorBtn: document.getElementById('playlistSelectorBtn'),
            playlistSelectorDropdown: document.getElementById('playlistSelectorDropdown'),
            currentPlaylistName: document.getElementById('currentPlaylistName')
        };

        this.visibleCount = Math.ceil(window.innerHeight / CONFIG.itemHeight) + 5;
        this.isDropdownOpen = false;
        this.isSelectorOpen = false;
        this.pendingSource = null; // 待确认的播放列表源
        this.currentSource = 'music'; // 当前播放列表源
        this.setupEventListeners();
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 播放列表滚动（使用节流）
        if (this.elements.playlistContent) {
            this.elements.playlistContent.addEventListener('scroll', () => {
                this.scrollTop = this.elements.playlistContent.scrollTop;
                
                // 使用 requestAnimationFrame 节流
                if (!this._scrollThrottleId) {
                    this._scrollThrottleId = requestAnimationFrame(() => {
                        this._scrollThrottleId = null;
                        eventBus.emit('ui:scroll', { scrollTop: this.scrollTop });
                    });
                }
            }, { passive: true });
        }
        
        // 搜索输入防抖
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                if (this._searchDebounceId) {
                    clearTimeout(this._searchDebounceId);
                }
                this._searchDebounceId = setTimeout(() => {
                    eventBus.emit('ui:search', { query: e.target.value });
                }, this._searchDebounceDelay);
            });
        }

        // 文件拖放
        if (this.elements.fileDropZone) {
            this.elements.fileDropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.fileDropZone.classList.add('dragover');
            });

            this.elements.fileDropZone.addEventListener('dragleave', () => {
                this.elements.fileDropZone.classList.remove('dragover');
            });

            this.elements.fileDropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.fileDropZone.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    eventBus.emit(EVENTS.FILES_SELECTED, { files: e.dataTransfer.files });
                }
            });

            this.elements.fileDropZone.addEventListener('click', () => {
                if (this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            });
        }

        // 文件选择
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    eventBus.emit(EVENTS.FILES_SELECTED, { files: e.target.files });
                }
            });
        }
        
        // 下拉列表切换
        if (this.elements.playlistToggleBtn) {
            this.elements.playlistToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }
        
        // 点击外部关闭下拉列表
        document.addEventListener('click', (e) => {
            if (this.isDropdownOpen && 
                this.elements.playlistDropdown &&
                !this.elements.playlistDropdown.contains(e.target) &&
                !this.elements.playlistToggleBtn.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // ESC 键关闭下拉列表
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isDropdownOpen) {
                    this.closeDropdown();
                }
                if (this.isSelectorOpen) {
                    this.closeSelectorDropdown();
                }
            }
        });
        
        // 播放列表选择器切换
        if (this.elements.playlistSelectorBtn) {
            this.elements.playlistSelectorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSelectorDropdown();
            });
        }
        
        // 点击外部关闭选择器下拉列表
        document.addEventListener('click', (e) => {
            if (this.isSelectorOpen && 
                this.elements.playlistSelectorDropdown &&
                !this.elements.playlistSelectorDropdown.contains(e.target) &&
                !this.elements.playlistSelectorBtn.contains(e.target)) {
                this.closeSelectorDropdown();
            }
        });
    }
    
    /**
     * 切换下拉列表
     */
    toggleDropdown() {
        if (this.isDropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    /**
     * 打开下拉列表
     */
    openDropdown() {
        if (!this.elements.playlistDropdown || !this.elements.playlistToggleBtn) return;
        
        this.isDropdownOpen = true;
        this.elements.playlistDropdown.classList.add('show');
        this.elements.playlistToggleBtn.classList.add('active');
    }
    
    /**
     * 关闭下拉列表
     */
    closeDropdown() {
        if (!this.elements.playlistDropdown || !this.elements.playlistToggleBtn) return;
        
        this.isDropdownOpen = false;
        this.elements.playlistDropdown.classList.remove('show');
        this.elements.playlistToggleBtn.classList.remove('active');
    }
    
    /**
     * 切换播放列表选择器
     */
    toggleSelectorDropdown() {
        if (this.isSelectorOpen) {
            this.closeSelectorDropdown();
        } else {
            this.openSelectorDropdown();
        }
    }
    
    /**
     * 打开播放列表选择器
     */
    openSelectorDropdown() {
        if (!this.elements.playlistSelectorDropdown || !this.elements.playlistSelectorBtn) return;
        
        this.isSelectorOpen = true;
        this.elements.playlistSelectorDropdown.classList.add('show');
        this.elements.playlistSelectorBtn.classList.add('active');
    }
    
    /**
     * 关闭播放列表选择器
     */
    closeSelectorDropdown() {
        if (!this.elements.playlistSelectorDropdown || !this.elements.playlistSelectorBtn) return;
        
        this.isSelectorOpen = false;
        this.pendingSource = null; // 关闭时重置待选状态
        this.elements.playlistSelectorDropdown.classList.remove('show');
        this.elements.playlistSelectorBtn.classList.remove('active');
    }
    
    /**
     * 更新播放列表选择器
     * @param {Array} sources - 可用的播放列表源
     * @param {string} current - 当前选中的源
     */
    updatePlaylistSelector(sources, current) {
        if (!this.elements.playlistSelectorDropdown) return;
        
        this.currentSource = current;
        this.pendingSource = null;
        this.availableSources = sources;
        
        // 更新当前显示的名称
        if (this.elements.currentPlaylistName) {
            this.elements.currentPlaylistName.textContent = current;
        }
        
        this._renderSelectorDropdown();
    }
    
    /**
     * 渲染选择器下拉菜单
     */
    _renderSelectorDropdown() {
        if (!this.elements.playlistSelectorDropdown) return;
        
        const sources = this.availableSources || [];
        const current = this.currentSource;
        const pending = this.pendingSource;
        
        // 生成下拉选项
        const itemsHtml = sources.map(source => {
            const isActive = source === current;
            const isSelected = source === pending;
            let classes = 'playlist-selector-item';
            if (isActive) classes += ' active';
            if (isSelected) classes += ' selected';
            
            return `
                <div class="${classes}" data-source="${source}">
                    <span class="check-icon">✓</span>
                    <span>${source}</span>
                </div>
            `;
        }).join('');
        
        // 添加确认/取消按钮
        const actionsHtml = `
            <div class="playlist-selector-actions">
                <button class="selector-cancel-btn">取消</button>
                <button class="selector-confirm-btn"${pending ? '' : ' disabled'}>确定</button>
            </div>
        `;
        
        this.elements.playlistSelectorDropdown.innerHTML = itemsHtml + actionsHtml;
        
        // 使用事件委托处理所有点击事件
        this.elements.playlistSelectorDropdown.onclick = (e) => {
            const target = e.target;
            
            // 处理选项点击
            const item = target.closest('.playlist-selector-item');
            if (item) {
                e.stopPropagation();
                const source = item.dataset.source;
                if (source === this.currentSource) {
                    // 点击当前源，取消选择
                    this.pendingSource = null;
                } else {
                    this.pendingSource = source;
                }
                this._updateSelectorUI();
                return;
            }
            
            // 处理取消按钮
            if (target.classList.contains('selector-cancel-btn')) {
                e.stopPropagation();
                this.pendingSource = null;
                this.closeSelectorDropdown();
                return;
            }
            
            // 处理确认按钮
            if (target.classList.contains('selector-confirm-btn') && this.pendingSource) {
                e.stopPropagation();
                const sourceToSwitch = this.pendingSource;
                this.closeSelectorDropdown();
                eventBus.emit('ui:switchSource', { source: sourceToSwitch });
                return;
            }
        };
    }
    
    /**
     * 更新选择器UI状态（不重新渲染整个下拉菜单）
     */
    _updateSelectorUI() {
        if (!this.elements.playlistSelectorDropdown) return;
        
        const pending = this.pendingSource;
        const current = this.currentSource;
        
        // 更新选项状态
        this.elements.playlistSelectorDropdown.querySelectorAll('.playlist-selector-item').forEach(item => {
            const source = item.dataset.source;
            item.classList.toggle('active', source === current);
            item.classList.toggle('selected', source === pending);
        });
        
        // 更新确认按钮状态
        const confirmBtn = this.elements.playlistSelectorDropdown.querySelector('.selector-confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = !pending;
        }
    }

    /**
     * 渲染播放列表
     * @param {Array} list - 歌曲列表
     * @param {number} currentIndex - 当前播放索引
     * @param {boolean} isLocalMode - 是否为本地模式
     */
    renderPlaylist(list, currentIndex, isLocalMode = false) {
        const container = this.elements.playlistContent;
        if (!container) return;

        // 本地模式且列表为空时显示文件选择区域
        if (isLocalMode && list.length === 0) {
            this._clearItemPool();
            container.innerHTML = `
                <div id="fileDropZone" class="file-drop-zone">
                    <div class="file-drop-zone-icon">📁</div>
                    <p>点击选择或拖放音乐文件</p>
                    <p style="font-size: 0.8em; margin-top: 10px;">支持 MP3, WAV, OGG, FLAC, M4A 等格式</p>
                </div>
                <input type="file" id="fileInput" class="file-input-hidden" multiple accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac">
            `;
            
            this.elements.fileDropZone = document.getElementById('fileDropZone');
            this.elements.fileInput = document.getElementById('fileInput');
            this.setupEventListeners();
            
            this.elements.songCount.textContent = '0 首歌曲';
            this._lastRenderState = null;
            return;
        }

        if (list.length === 0) {
            this._clearItemPool();
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <p>未找到匹配的歌曲</p>
                </div>
            `;
            this.elements.songCount.textContent = '0 首歌曲';
            this._lastRenderState = null;
            return;
        }

        // 虚拟滚动计算
        const startIndex = Math.floor(this.scrollTop / CONFIG.itemHeight);
        const endIndex = Math.min(startIndex + this.visibleCount, list.length);

        // 性能优化：检查是否需要重新渲染
        const renderKey = `${startIndex}-${endIndex}-${currentIndex}-${list.length}`;
        if (this._lastRenderState === renderKey) {
            return;
        }
        this._lastRenderState = renderKey;

        // 确保 wrapper 存在
        let wrapper = container.querySelector('.virtual-scroll-wrapper');
        if (!wrapper) {
            container.innerHTML = '';
            wrapper = document.createElement('div');
            wrapper.className = 'virtual-scroll-wrapper';
            wrapper.style.cssText = 'position: relative;';
            container.appendChild(wrapper);
        }
        wrapper.style.height = `${list.length * CONFIG.itemHeight}px`;

        // 标记当前活动的索引
        const neededIndices = new Set();
        for (let i = startIndex; i < endIndex; i++) {
            neededIndices.add(i);
        }

        // 移除不再需要的元素，回收到池中
        for (const [idx, item] of this._activeItems) {
            if (!neededIndices.has(idx)) {
                item.style.display = 'none';
                this._itemPool.push(item);
                this._activeItems.delete(idx);
            }
        }

        // 渲染需要的元素
        for (let i = startIndex; i < endIndex; i++) {
            if (this._activeItems.has(i)) {
                // 更新现有元素的 active 状态
                const item = this._activeItems.get(i);
                if (i === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
                continue;
            }

            const song = list[i];
            const displayName = song.name.replace(/\.[^/.]+$/, '');
            
            // 从池中取或创建新元素
            let item = this._itemPool.pop();
            if (!item) {
                item = document.createElement('div');
                item.className = 'song-item';
                wrapper.appendChild(item);
            }
            
            item.style.display = '';
            item.style.cssText = `position: absolute; top: ${i * CONFIG.itemHeight}px; left: 0; right: 0;`;
            item.className = `song-item${i === currentIndex ? ' active' : ''}`;
            item.dataset.index = i;
            
            item.innerHTML = `
                <div class="song-number">${i + 1}</div>
                <div class="song-details">
                    <div class="song-name">${displayName}</div>
                    <div class="song-meta">${song.size || '--'} MB · ${song.duration || '--:--'}</div>
                </div>
            `;
            
            this._activeItems.set(i, item);
        }

        this.elements.songCount.textContent = `${list.length} 首歌曲`;
        container.style.overflowY = 'scroll';
    }

    /**
     * 清空 DOM 池
     */
    _clearItemPool() {
        this._itemPool = [];
        this._activeItems.clear();
    }

    /**
     * 更新播放按钮状态
     * @param {boolean} isPlaying - 是否播放中
     */
    updatePlayButton(isPlaying) {
        if (this.elements.playBtn) {
            this.elements.playBtn.innerHTML = isPlaying ? PLAY_ICONS.pause : PLAY_ICONS.play;
        }
        if (this.elements.albumArt) {
            if (isPlaying) {
                this.elements.albumArt.classList.add('playing');
            } else {
                this.elements.albumArt.classList.remove('playing');
            }
        }
    }

    /**
     * 更新循环模式按钮
     * @param {string} mode - 循环模式
     */
    updateLoopButton(mode) {
        if (this.elements.loopBtn) {
            this.elements.loopBtn.innerHTML = LOOP_ICONS[mode] || LOOP_ICONS.list;
            
            const titles = {
                list: '列表循环',
                single: '单曲循环',
                random: '随机播放'
            };
            this.elements.loopBtn.title = titles[mode] || '列表循环';
        }
    }

    /**
     * 更新进度条
     * @param {number} progress - 进度百分比
     * @param {number} currentTime - 当前时间
     * @param {number} duration - 总时长
     */
    updateProgress(progress, currentTime, duration) {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = progress + '%';
        }
        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = this.formatTime(currentTime);
        }
        if (this.elements.duration) {
            this.elements.duration.textContent = this.formatTime(duration);
        }
    }

    /**
     * 更新当前歌曲标题
     * @param {string} title - 歌曲标题
     */
    updateSongTitle(title) {
        // 去除文件后缀
        const displayTitle = title.replace(/\.[^/.]+$/, '');
        
        // 更新磁带仓标签显示歌曲名
        if (this.elements.cassetteLabel) {
            this.elements.cassetteLabel.textContent = `♪ ${displayTitle} ♪`;
        }
    }

    /**
     * 更新音效名称
     * @param {string} name - 音效名称
     */
    updateEffectName(name) {
        if (this.elements.effectName) {
            this.elements.effectName.textContent = name;
        }
    }

    /**
     * 格式化时间
     * @param {number} seconds - 秒数
     * @returns {string}
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * 显示错误提示
     * @param {string} message - 错误信息
     */
    showError(message) {
        alert(message);
    }

    /**
     * 获取元素
     * @param {string} name - 元素名称
     */
    getElement(name) {
        return this.elements[name];
    }

    /**
     * 重置滚动位置
     */
    resetScroll() {
        this.scrollTop = 0;
        if (this.elements.playlistContent) {
            this.elements.playlistContent.scrollTop = 0;
        }
    }
}

// 导出单例
export const uiController = new UIController();
