/**
 * 事件总线模块 - 模块间通信
 * 使用发布/订阅模式解耦各模块
 */

class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅的函数
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        
        // 返回取消订阅函数
        return () => this.off(event, callback);
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * 发布事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     */
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event handler error for "${event}":`, error);
                }
            });
        }
    }

    /**
     * 一次性订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

// 事件名称常量
export const EVENTS = {
    // 播放相关
    PLAY: 'play',
    PAUSE: 'pause',
    STOP: 'stop',
    NEXT: 'next',
    PREV: 'prev',
    SEEK: 'seek',
    
    // 状态变化
    SONG_CHANGE: 'songChange',
    PLAYING_STATE_CHANGE: 'playingStateChange',
    PROGRESS_UPDATE: 'progressUpdate',
    VOLUME_CHANGE: 'volumeChange',
    
    // 播放列表
    PLAYLIST_LOADED: 'playlistLoaded',
    PLAYLIST_FILTERED: 'playlistFiltered',
    PLAYLIST_SOURCE_CHANGE: 'playlistSourceChange',
    PLAYLIST_SOURCES_LOADED: 'playlistSourcesLoaded',
    
    // 音效
    EFFECT_CHANGE: 'effectChange',
    
    // 循环模式
    LOOP_MODE_CHANGE: 'loopModeChange',
    
    // 可视化
    AUDIO_DATA_UPDATE: 'audioDataUpdate',
    
    // 文件
    FILES_SELECTED: 'filesSelected'
};

// 导出单例
export const eventBus = new EventBus();
