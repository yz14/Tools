/**
 * dialog.js - 对话框模块
 * 管理媒体插入对话框和元数据编辑对话框
 */

const JournalDialog = (function() {
    const { $, $$ } = JournalUtils;

    /**
     * 打开媒体对话框
     * @param {string} type - 媒体类型 ('image' 或 'video')
     */
    function openMediaDialog(type) {
        // 保存当前选区
        const savedSelection = JournalUtils.saveSelection();
        JournalState.set('savedSelection', savedSelection);
        JournalState.set('currentMediaType', type);
        
        const dialog = $('#mediaDialog');
        const overlay = $('#overlay');
        const dialogTitle = $('#dialogTitle');
        
        dialogTitle.textContent = type === 'image' ? '插入图片' : '插入视频';
        $('#mediaPath').placeholder = 
            type === 'image' ? '输入相对路径，如：./imgs/photo.jpg' : '输入相对路径，如：./videos/video.mp4';
        
        dialog.classList.add('active');
        overlay.classList.add('active');
        
        // 清空输入
        $('#mediaPath').value = '';
        $('#mediaCaption').value = '';
        $('#multipleMedia').checked = false;
        
        // 重置尺寸选择
        $$('.size-option').forEach(o => o.classList.remove('active'));
        $('.size-option[data-size="medium"]').classList.add('active');
    }

    /**
     * 关闭媒体对话框
     */
    function closeMediaDialog() {
        $('#mediaDialog').classList.remove('active');
        $('#overlay').classList.remove('active');
    }

    /**
     * 打开元数据对话框
     */
    function openMetaDialog() {
        const dialog = $('#metaDialog');
        const overlay = $('#overlay');
        
        // 获取当前焦点所在的entry
        const selection = window.getSelection();
        let node = selection.anchorNode;
        let currentEntry = null;
        
        while (node && node !== document) {
            if (node.classList && node.classList.contains('journal-entry')) {
                currentEntry = node;
                break;
            }
            node = node.parentNode;
        }
        
        if (!currentEntry) {
            alert('请先点击要编辑的日记条目');
            return;
        }
        
        JournalState.set('currentEntryForMeta', currentEntry);
        
        // 从当前条目读取现有值
        parseExistingMeta(currentEntry);
        
        dialog.classList.add('active');
        overlay.classList.add('active');
    }

    /**
     * 解析现有元数据
     * @param {Element} entry - 日记条目元素
     */
    function parseExistingMeta(entry) {
        const metaItems = entry.querySelectorAll('.meta-item');
        
        metaItems.forEach(item => {
            const iconEl = item.querySelector('.meta-icon');
            const icon = iconEl ? iconEl.textContent.trim() : '';
            const text = item.textContent.replace(icon, '').trim();
            
            // 解析天气和温度
            if (text.includes('°C') || text.includes('°F')) {
                const parts = text.split('·').map(s => s.trim());
                if (parts.length >= 1) {
                    const weatherSelect = $('#weatherSelect');
                    for (let opt of weatherSelect.options) {
                        if (opt.value.includes(icon)) {
                            weatherSelect.value = opt.value;
                            break;
                        }
                    }
                }
                if (parts.length >= 2) {
                    const tempMatch = parts[1].match(/(-?\d+)(°[CF])/);
                    if (tempMatch) {
                        $('#temperatureInput').value = tempMatch[1];
                        $('#tempUnitSelect').value = tempMatch[2];
                    }
                }
            }
            // 解析地点
            else if (icon === '📍') {
                $('#locationInput').value = text;
            }
            // 解析时段
            else if (['🌅', '🌄', '☀️', '🌞', '🌇', '🌆', '🌃', '🌙'].includes(icon)) {
                const timeSelect = $('#timeSelect');
                for (let opt of timeSelect.options) {
                    if (opt.value.includes(icon)) {
                        timeSelect.value = opt.value;
                        break;
                    }
                }
            }
            // 解析心情
            else if (['😊', '😄', '🥰', '😌', '🙂', '😐', '🤔', '😔', '😢', '😤', '😰', '😴', '🤩', '😇', '🥱', '💪', '💭'].includes(icon)) {
                const moodSelect = $('#moodSelect');
                for (let opt of moodSelect.options) {
                    if (opt.value.includes(icon)) {
                        moodSelect.value = opt.value;
                        break;
                    }
                }
            }
            // 解析活动
            else if (icon === '🏷️') {
                $('#activityInput').value = text;
            }
            // 解析同行人
            else if (icon === '👥') {
                $('#companionInput').value = text;
            }
        });
    }

    /**
     * 关闭元数据对话框
     */
    function closeMetaDialog() {
        $('#metaDialog').classList.remove('active');
        $('#overlay').classList.remove('active');
        JournalState.set('currentEntryForMeta', null);
    }

    /**
     * 确认更新元数据
     */
    function confirmUpdateMeta() {
        const currentEntry = JournalState.get('currentEntryForMeta');
        if (!currentEntry) return;
        
        const weather = $('#weatherSelect').value;
        const temperature = $('#temperatureInput').value;
        const tempUnit = $('#tempUnitSelect').value;
        const location = $('#locationInput').value;
        const mood = $('#moodSelect').value;
        const timeOfDay = $('#timeSelect').value;
        const activity = $('#activityInput').value;
        const companion = $('#companionInput').value;
        
        let metaHTML = '';
        
        // 天气和温度
        const weatherIcon = weather.split(' ')[0];
        const weatherText = weather.split(' ')[1];
        const tempStr = temperature ? ` · ${temperature}${tempUnit}` : '';
        metaHTML += `
            <span class="meta-item">
                <span class="meta-icon">${weatherIcon}</span>
                ${weatherText}${tempStr}
            </span>
        `;
        
        // 地点
        if (location) {
            metaHTML += `
                <span class="meta-item">
                    <span class="meta-icon">📍</span>
                    ${location}
                </span>
            `;
        }
        
        // 时段
        const timeIcon = timeOfDay.split(' ')[0];
        const timeText = timeOfDay.split(' ')[1];
        metaHTML += `
            <span class="meta-item">
                <span class="meta-icon">${timeIcon}</span>
                ${timeText}
            </span>
        `;
        
        // 心情
        const moodIcon = mood.split(' ')[0];
        const moodText = mood.split(' ')[1];
        metaHTML += `
            <span class="meta-item">
                <span class="meta-icon">${moodIcon}</span>
                ${moodText}
            </span>
        `;
        
        // 活动标签
        if (activity) {
            metaHTML += `
                <span class="meta-item">
                    <span class="meta-icon">🏷️</span>
                    ${activity}
                </span>
            `;
        }
        
        // 同行人
        if (companion) {
            metaHTML += `
                <span class="meta-item">
                    <span class="meta-icon">👥</span>
                    ${companion}
                </span>
            `;
        }
        
        const metaDiv = currentEntry.querySelector('.entry-meta');
        metaDiv.innerHTML = metaHTML;
        
        // 重置输入
        $('#locationInput').value = '';
        $('#temperatureInput').value = '';
        $('#activityInput').value = '';
        $('#companionInput').value = '';
        
        closeMetaDialog();
    }

    /**
     * 初始化尺寸选项点击事件
     */
    function initSizeOptions() {
        $$('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                $$('.size-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    /**
     * 初始化对话框
     */
    function init() {
        initSizeOptions();
        
        // 点击遮罩关闭对话框
        const overlay = $('#overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMediaDialog();
                closeMetaDialog();
            });
        }
    }

    // 公开API
    return {
        openMediaDialog,
        closeMediaDialog,
        openMetaDialog,
        closeMetaDialog,
        confirmUpdateMeta,
        init
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalDialog;
}
