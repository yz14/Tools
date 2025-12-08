/**
 * 配置模块 - 集中管理所有配置项
 */

export const CONFIG = {
    // 音效预设
    audioEffects: [
        { name: '正常', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: '低音增强', gains: [8, 6, 4, 2, 0, 0, 0, 0, 0, 0] },
        { name: '高音增强', gains: [0, 0, 0, 0, 0, 0, 2, 4, 6, 8] },
        { name: '人声增强', gains: [0, 0, 2, 4, 6, 4, 2, 0, 0, 0] },
        { name: '摇滚', gains: [6, 4, 2, 0, -2, 0, 2, 4, 6, 6] },
        { name: '流行', gains: [2, 3, 4, 3, 0, -1, 1, 2, 3, 4] },
        { name: '古典', gains: [4, 3, 2, 0, 0, 0, -1, 2, 3, 4] },
        { name: '爵士', gains: [4, 3, 1, 2, -2, -2, 0, 1, 3, 4] },
        { name: '电子', gains: [4, 3, 0, -2, 2, 4, 4, 3, 2, 5] },
        { name: '演唱会', gains: [4, 0, 3, 4, 3, 0, 0, 3, 4, 4] }
    ],
    
    // 均衡器频率
    eqFrequencies: [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],
    
    // 虚拟滚动配置
    itemHeight: 40,
    
    // 循环模式
    loopModes: {
        LIST: 'list',
        SINGLE: 'single',
        RANDOM: 'random'
    },
    
    // 默认音量
    defaultVolume: 0.7,
    
    // 快进/快退秒数
    seekSeconds: 10,
    
    // 搜索防抖延迟
    searchDebounce: 300,
    
    // 演示数据艺术家
    demoArtists: ['周杰伦', '林俊杰', '邓紫棋', '薛之谦', '毛不易', '陈奕迅', '张学友', '王菲']
};

// 循环模式图标
export const LOOP_ICONS = {
    list: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>`,
    single: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">1</text>
    </svg>`,
    random: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 3 21 3 21 8"/>
        <line x1="4" y1="20" x2="21" y2="3"/>
        <polyline points="21 16 21 21 16 21"/>
        <line x1="15" y1="15" x2="21" y2="21"/>
        <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>`
};

// 播放/暂停图标
export const PLAY_ICONS = {
    play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="8 5 19 12 8 19 8 5"/>
    </svg>`,
    pause: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>`
};
