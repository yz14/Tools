/**
 * 音频引擎模块 - 处理所有音频相关功能
 * 包括 Web Audio API、均衡器、音频分析
 */

import { CONFIG } from './config.js';
import { eventBus, EVENTS } from './eventBus.js';

class AudioEngine {
    constructor() {
        this.audioElement = null;
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.filters = [];
        this.dataArray = null;
        this.bufferLength = 0;
        this.currentEffect = 0;
        this.isInitialized = false;
    }

    /**
     * 初始化音频引擎
     * @param {HTMLAudioElement} audioElement - 音频元素
     */
    init(audioElement) {
        this.audioElement = audioElement;
        this.audioElement.volume = CONFIG.defaultVolume;
        this.setupEventListeners();
    }

    /**
     * 初始化 Web Audio API
     */
    initAudioContext() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            // 连接音频源
            this.source = this.audioContext.createMediaElementSource(this.audioElement);

            // 创建均衡器滤波器
            this.filters = CONFIG.eqFrequencies.map((freq, i) => {
                const filter = this.audioContext.createBiquadFilter();
                filter.type = i === 0 ? 'lowshelf' : 
                              i === CONFIG.eqFrequencies.length - 1 ? 'highshelf' : 'peaking';
                filter.frequency.value = freq;
                filter.Q.value = 1;
                filter.gain.value = 0;
                return filter;
            });

            // 连接音频链
            this.source.connect(this.filters[0]);
            for (let i = 0; i < this.filters.length - 1; i++) {
                this.filters[i].connect(this.filters[i + 1]);
            }
            this.filters[this.filters.length - 1].connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.isInitialized = true;
            console.log('Audio Context 初始化成功');
        } catch (error) {
            console.error('Audio Context 初始化失败:', error);
        }
    }

    /**
     * 恢复音频上下文
     */
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 节流进度更新，避免过于频繁的DOM操作
        let lastProgressUpdate = 0;
        const progressUpdateInterval = 100; // 100ms 更新一次
        
        this.audioElement.addEventListener('timeupdate', () => {
            const now = performance.now();
            if (now - lastProgressUpdate < progressUpdateInterval) return;
            lastProgressUpdate = now;
            
            if (this.audioElement.duration) {
                eventBus.emit(EVENTS.PROGRESS_UPDATE, {
                    currentTime: this.audioElement.currentTime,
                    duration: this.audioElement.duration,
                    progress: (this.audioElement.currentTime / this.audioElement.duration) * 100
                });
            }
        });

        this.audioElement.addEventListener('ended', () => {
            eventBus.emit(EVENTS.NEXT, { auto: true });
        });

        this.audioElement.addEventListener('play', () => {
            eventBus.emit(EVENTS.PLAYING_STATE_CHANGE, { isPlaying: true });
        });

        this.audioElement.addEventListener('pause', () => {
            eventBus.emit(EVENTS.PLAYING_STATE_CHANGE, { isPlaying: false });
        });
    }

    /**
     * 播放音频
     * @param {string} src - 音频源（URL 或 Blob URL）
     * @returns {Promise<boolean>}
     */
    async play(src) {
        try {
            if (src && this.audioElement.src !== src) {
                this.audioElement.src = src;
            }
            
            await this.audioElement.play();
            this.initAudioContext();
            await this.resumeContext();
            return true;
        } catch (error) {
            console.error('播放失败:', error);
            return false;
        }
    }

    /**
     * 暂停播放
     */
    pause() {
        this.audioElement.pause();
    }

    /**
     * 切换播放/暂停
     */
    togglePlay() {
        if (this.audioElement.paused) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    }

    /**
     * 跳转到指定时间
     * @param {number} time - 目标时间（秒）
     */
    seek(time) {
        if (!this.audioElement.duration || isNaN(this.audioElement.duration)) {
            return;
        }
        
        const newTime = Math.max(0, Math.min(this.audioElement.duration - 0.5, time));
        const wasPlaying = !this.audioElement.paused;
        
        // 使用 fastSeek 如果可用（更快），否则使用 currentTime
        if (typeof this.audioElement.fastSeek === 'function') {
            this.audioElement.fastSeek(newTime);
        } else {
            this.audioElement.currentTime = newTime;
        }
        
        // 如果 seek 失败（currentTime 被重置为 0），尝试等待 canplay 事件后重试
        if (this.audioElement.currentTime === 0 && newTime > 0) {
            const retrySeek = () => {
                this.audioElement.currentTime = newTime;
                this.audioElement.removeEventListener('canplay', retrySeek);
            };
            this.audioElement.addEventListener('canplay', retrySeek, { once: true });
        }
        
        if (wasPlaying && this.audioElement.paused) {
            this.audioElement.play();
        }
    }

    /**
     * 快进
     * @param {number} seconds - 秒数
     */
    forward(seconds = CONFIG.seekSeconds) {
        this.seek(this.audioElement.currentTime + seconds);
    }

    /**
     * 快退
     * @param {number} seconds - 秒数
     */
    rewind(seconds = CONFIG.seekSeconds) {
        this.seek(this.audioElement.currentTime - seconds);
    }

    /**
     * 设置音量
     * @param {number} volume - 音量 (0-1)
     */
    setVolume(volume) {
        this.audioElement.volume = Math.max(0, Math.min(1, volume));
        eventBus.emit(EVENTS.VOLUME_CHANGE, { volume: this.audioElement.volume });
    }

    /**
     * 应用音效
     * @param {number} index - 音效索引
     */
    applyEffect(index) {
        if (this.filters.length === 0) return;

        this.currentEffect = index;
        const effect = CONFIG.audioEffects[index];
        
        effect.gains.forEach((gain, i) => {
            if (this.filters[i]) {
                this.filters[i].gain.value = gain;
            }
        });

        eventBus.emit(EVENTS.EFFECT_CHANGE, { 
            index, 
            name: effect.name 
        });
    }

    /**
     * 下一个音效
     */
    nextEffect() {
        const nextIndex = (this.currentEffect + 1) % CONFIG.audioEffects.length;
        this.applyEffect(nextIndex);
    }

    /**
     * 上一个音效
     */
    prevEffect() {
        const prevIndex = (this.currentEffect - 1 + CONFIG.audioEffects.length) % CONFIG.audioEffects.length;
        this.applyEffect(prevIndex);
    }

    /**
     * 获取频率数据（用于可视化）
     * @returns {Uint8Array|null}
     */
    getFrequencyData() {
        if (!this.analyser || !this.dataArray) return null;
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    /**
     * 获取时域数据（用于波形）
     * @returns {Uint8Array|null}
     */
    getTimeDomainData() {
        if (!this.analyser || !this.dataArray) return null;
        this.analyser.getByteTimeDomainData(this.dataArray);
        return this.dataArray;
    }

    /**
     * 获取当前状态
     */
    getState() {
        return {
            isPlaying: !this.audioElement.paused,
            currentTime: this.audioElement.currentTime,
            duration: this.audioElement.duration || 0,
            volume: this.audioElement.volume,
            currentEffect: this.currentEffect,
            effectName: CONFIG.audioEffects[this.currentEffect].name
        };
    }

    /**
     * 获取缓冲长度
     */
    getBufferLength() {
        return this.bufferLength;
    }

    /**
     * 检查是否已初始化
     */
    isReady() {
        return this.isInitialized;
    }
}

// 导出单例
export const audioEngine = new AudioEngine();
