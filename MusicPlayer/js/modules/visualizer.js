/**
 * 可视化模块 - 音频波形和VU表
 * 性能优化版本
 */

import { audioEngine } from './audioEngine.js';
import { eventBus, EVENTS } from './eventBus.js';

class Visualizer {
    constructor() {
        this.waveformCanvas = null;
        this.waveformCtx = null;
        this.vuCanvasL = null;
        this.vuCanvasR = null;
        this.vuCtxL = null;
        this.vuCtxR = null;
        this.vuNeedleL = null;
        this.vuNeedleR = null;
        this.isPlaying = false;
        this.animationId = null;
        this.vuInitialized = false;
        
        // 性能优化：缓存和节流
        this.lastVUUpdate = 0;
        this.vuUpdateInterval = 50; // VU表更新间隔(ms)
        this.sampleStep = 4; // 波形降采样步长
        this.lastLeftAngle = -70;
        this.lastRightAngle = -70;
        
        // 性能优化：帧率控制
        this.targetFPS = 30; // 目标帧率，降低 CPU 使用
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        
        // 性能优化：可见性检测
        this.isVisible = true;
        this._visibilityHandler = this._handleVisibility.bind(this);
        
        // 绑定方法以避免每次创建新函数
        this._boundDrawWaveform = this._animationLoop.bind(this);
    }
    
    /**
     * 动画循环 - 帧率控制版本
     */
    _animationLoop(timestamp) {
        if (!this.isPlaying) return;
        
        this.animationId = requestAnimationFrame(this._boundDrawWaveform);
        
        // 帧率控制：限制到目标 FPS
        const elapsed = timestamp - this.lastFrameTime;
        if (elapsed < this.frameInterval) return;
        this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
        
        // 页面不可见时跳过渲染
        if (!this.isVisible) return;
        
        this._drawFrame();
    }
    
    /**
     * 处理页面可见性变化
     */
    _handleVisibility() {
        this.isVisible = !document.hidden;
    }

    /**
     * 初始化波形画布
     * @param {HTMLCanvasElement} canvas - 波形画布
     */
    initWaveform(canvas) {
        this.waveformCanvas = canvas;
        this.waveformCtx = canvas.getContext('2d');
        this.resizeWaveformCanvas();
    }

    /**
     * 初始化VU表
     * @param {Object} elements - VU表元素
     */
    initVUMeters(elements) {
        this.vuCanvasL = elements.canvasL;
        this.vuCanvasR = elements.canvasR;
        this.vuNeedleL = elements.needleL;
        this.vuNeedleR = elements.needleR;

        if (!this.vuNeedleL || !this.vuNeedleR) return;

        // 不绘制刻度，只初始化
        this.vuInitialized = true;
    }

    /**
     * 调整波形画布大小
     */
    resizeWaveformCanvas() {
        if (!this.waveformCanvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = this.waveformCanvas.getBoundingClientRect();
        this.waveformCanvas.width = rect.width * dpr;
        this.waveformCanvas.height = rect.height * dpr;
        this.waveformCanvas.style.width = rect.width + 'px';
        this.waveformCanvas.style.height = rect.height + 'px';
    }

    /**
     * 绘制VU表刻度
     */
    drawVUScale(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height - 10;
        const radius = height - 20;

        ctx.clearRect(0, 0, width, height);

        const startAngle = -Math.PI * 0.75;
        const endAngle = Math.PI * 0.75;
        const steps = 14;

        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / steps);
            const isMainTick = i % 2 === 0;
            const tickLength = isMainTick ? 10 : 6;
            const tickWidth = isMainTick ? 2 : 1;

            const x1 = centerX + Math.cos(angle) * (radius - tickLength);
            const y1 = centerY + Math.sin(angle) * (radius - tickLength);
            const x2 = centerX + Math.cos(angle) * radius;
            const y2 = centerY + Math.sin(angle) * radius;

            let color;
            if (i / steps < 0.5) {
                color = '#00d4ff';
            } else if (i / steps < 0.8) {
                color = '#ffaa00';
            } else {
                color = '#ff4444';
            }

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = tickWidth;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    /**
     * 更新VU表指针 - 旋转模式
     */
    updateVUMeters() {
        if (!this.vuInitialized) return;
        
        if (!this.isPlaying) {
            // 重置到初始位置 (-90度，标准上半圆最左侧)
            if (this.lastLeftAngle !== -90 || this.lastRightAngle !== -90) {
                this.lastLeftAngle = -90;
                this.lastRightAngle = -90;
                this.vuNeedleL.style.transform = 'translateX(-50%) rotate(-90deg)';
                this.vuNeedleR.style.transform = 'translateX(-50%) rotate(-90deg)';
            }
            return;
        }

        // 节流：限制更新频率
        const now = performance.now();
        if (now - this.lastVUUpdate < this.vuUpdateInterval) return;
        this.lastVUUpdate = now;

        const dataArray = audioEngine.getFrequencyData();
        if (!dataArray) return;

        const bufferLength = audioEngine.getBufferLength();
        const halfLength = bufferLength >> 1;

        // 计算左右声道电平
        let leftSum = 0;
        let rightSum = 0;
        for (let i = 0; i < halfLength; i++) {
            leftSum += dataArray[i];
            rightSum += dataArray[halfLength + i];
        }

        const leftLevel = leftSum / (halfLength * 255);
        const rightLevel = rightSum / (halfLength * 255);

        // 角度从 -90 到 90（标准上半圆）
        const leftAngle = Math.round(-90 + leftLevel * 180);
        const rightAngle = Math.round(-90 + rightLevel * 180);

        if (leftAngle !== this.lastLeftAngle) {
            this.lastLeftAngle = leftAngle;
            this.vuNeedleL.style.transform = `translateX(-50%) rotate(${leftAngle}deg)`;
        }
        if (rightAngle !== this.lastRightAngle) {
            this.lastRightAngle = rightAngle;
            this.vuNeedleR.style.transform = `translateX(-50%) rotate(${rightAngle}deg)`;
        }
    }

    /**
     * 绘制静态波形（暂停状态）
     */
    _drawStaticWaveform() {
        if (!this.waveformCanvas || !this.waveformCtx) return;

        const width = this.waveformCanvas.width;
        const height = this.waveformCanvas.height;
        const ctx = this.waveformCtx;

        ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(80, 60, 40, 0.5)';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(80, 60, 40, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    /**
     * 绘制动态波形帧 - 优化版本
     */
    _drawFrame() {
        if (!this.waveformCanvas || !this.waveformCtx) return;

        // 更新VU表（内部有节流）
        this.updateVUMeters();

        if (!audioEngine.isReady()) {
            this._drawStaticWaveform();
            return;
        }

        const dataArray = audioEngine.getTimeDomainData();
        if (!dataArray) return;

        const width = this.waveformCanvas.width;
        const height = this.waveformCanvas.height;
        const ctx = this.waveformCtx;
        const bufferLength = audioEngine.getBufferLength();
        const step = this.sampleStep; // 降采样

        // 清空画布
        ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        ctx.fillRect(0, 0, width, height);

        // 计算平均音量强度（降采样计算）
        let sum = 0;
        const sampleCount = bufferLength / step;
        for (let i = 0; i < bufferLength; i += step) {
            sum += Math.abs(dataArray[i] - 128);
        }
        const intensity = Math.min(sum / (sampleCount * 30), 1);

        // 根据强度调整颜色
        const r = 153 + (intensity * 102) | 0; // Math.floor 优化
        const g = 80 + (intensity * 120) | 0;
        const b = 20 + (intensity * 30) | 0;

        // 绘制灯丝波形（降采样）
        ctx.beginPath();
        const sliceWidth = width / sampleCount;
        let x = 0;

        for (let i = 0; i < bufferLength; i += step) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        // 多层光晕效果 - 使用保存的路径多次描边
        const glowSize = 10 + intensity * 35;

        // 第一层：最外层大光晕
        ctx.lineWidth = 12 + intensity * 8;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.08 + intensity * 0.12})`;
        ctx.shadowBlur = glowSize * 2.5;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.3})`;
        ctx.stroke();

        // 第二层：中层光晕
        ctx.lineWidth = 8 + intensity * 5;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + intensity * 0.25})`;
        ctx.shadowBlur = glowSize * 1.5;
        ctx.stroke();

        // 第三层：内层强光
        ctx.lineWidth = 5 + intensity * 3;
        ctx.strokeStyle = `rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 10)}, ${0.5 + intensity * 0.3})`;
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = 'rgba(255, 240, 200, 0.85)';
        ctx.stroke();

        // 第四层：灯丝本体
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgba(255, 250, 230, ${0.9 + intensity * 0.1})`;
        ctx.shadowBlur = glowSize * 0.6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();

        // 第五层：灯丝高亮细线
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.97)';
        ctx.shadowBlur = 3 + intensity * 5;
        ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    /**
     * 绘制波形（公共接口）
     */
    drawWaveform() {
        this._drawStaticWaveform();
        this.updateVUMeters();
    }

    /**
     * 开始可视化
     */
    start() {
        // 防止重复启动动画循环
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.lastFrameTime = 0;
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', this._visibilityHandler);
        
        // 启动动画循环
        this._animationLoop(0);
    }

    /**
     * 停止可视化
     */
    stop() {
        this.isPlaying = false;
        
        // 移除可见性监听
        document.removeEventListener('visibilitychange', this._visibilityHandler);
        
        // 取消动画帧
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // 绘制静态状态
        this._drawStaticWaveform();
        this.updateVUMeters();
    }

    /**
     * 设置播放状态
     * @param {boolean} playing - 是否播放中
     */
    setPlaying(playing) {
        if (playing) {
            this.start();
        } else {
            this.stop();
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.resizeWaveformCanvas();
        if (this.isPlaying) {
            // 播放中不需要额外绘制，动画循环会处理
        } else {
            this._drawStaticWaveform();
        }
    }
}

// 导出单例
export const visualizer = new Visualizer();
