/**
 * media.js - 媒体模块
 * 处理图片、视频的插入和拖放
 */

const JournalMedia = (function() {
    const { $, $$, createElementFromHTML, findAncestorByClass } = JournalUtils;

    // 图片加载失败时的占位图
    const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';

    /**
     * 确认插入媒体
     */
    function confirmInsertMedia() {
        const path = $('#mediaPath').value;
        const caption = $('#mediaCaption').value;
        const size = $('.size-option.active').dataset.size;
        const isMultiple = $('#multipleMedia').checked;
        const currentMediaType = JournalState.get('currentMediaType');
        
        if (!path) {
            alert('请输入文件路径');
            return;
        }
        
        // 恢复保存的选区
        const savedSelection = JournalState.get('savedSelection');
        let targetContent = null;
        let currentP = null;
        
        if (savedSelection) {
            JournalUtils.restoreSelection(savedSelection);
            
            let node = savedSelection.startContainer;
            while (node && node !== document) {
                if (node.tagName === 'P') {
                    currentP = node;
                }
                if (node.classList && node.classList.contains('entry-content')) {
                    targetContent = node;
                    break;
                }
                node = node.parentNode;
            }
        }
        
        // 如果没有找到，默认使用最后一个
        if (!targetContent) {
            const contents = $$('.entry-content');
            targetContent = contents[contents.length - 1];
        }
        
        // 创建媒体HTML
        const mediaHTML = createMediaHTML(path, caption, size, isMultiple, currentMediaType);
        
        // 在段落后插入
        const p = document.createElement('p');
        p.innerHTML = '继续您的文字...';
        
        const mediaElement = createElementFromHTML(mediaHTML);
        
        if (currentP) {
            currentP.parentNode.insertBefore(mediaElement, currentP.nextSibling);
            currentP.parentNode.insertBefore(p, mediaElement.nextSibling);
        } else {
            try {
                if (savedSelection) {
                    savedSelection.insertNode(p);
                    savedSelection.insertNode(mediaElement);
                } else {
                    targetContent.appendChild(mediaElement);
                    targetContent.appendChild(p);
                }
            } catch(e) {
                targetContent.appendChild(mediaElement);
                targetContent.appendChild(p);
            }
        }
        
        // 清空输入并关闭对话框
        $('#mediaPath').value = '';
        $('#mediaCaption').value = '';
        $('#multipleMedia').checked = false;
        
        JournalDialog.closeMediaDialog();
        
        // 聚焦到新段落
        setTimeout(() => {
            if (p && p.focus) {
                p.focus();
            }
        }, 100);
    }

    /**
     * 创建媒体HTML
     */
    function createMediaHTML(path, caption, size, isMultiple, mediaType) {
        const figureCounter = JournalState.incrementCounter('figureCounter');
        const videoCounter = JournalState.incrementCounter('videoCounter');
        
        const mediaContent = mediaType === 'image' 
            ? `<img src="${path}" alt="${caption || '图片'}" onerror="this.src='${PLACEHOLDER_IMAGE}'">`
            : `<video controls><source src="${path}" type="video/mp4">您的浏览器不支持视频标签。</video>`;
        
        const captionHTML = caption ? `
            <div class="figure-caption">
                <span class="figure-label">${mediaType === 'image' ? 'Figure' : 'Video'} ${mediaType === 'image' ? figureCounter : videoCounter}</span> ${caption}
            </div>
        ` : '';
        
        if (isMultiple) {
            return `
                <div class="figure-container">
                    <div class="figure-row">
                        <div class="figure ${size}">
                            ${mediaContent}
                            ${captionHTML}
                        </div>
                        <!-- 在这里可以继续添加更多媒体 -->
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="figure-container">
                    <div class="figure ${size}">
                        ${mediaContent}
                        ${captionHTML}
                    </div>
                </div>
            `;
        }
    }

    /**
     * 插入拖放的图片
     * @param {string} dataUrl - 图片的Data URL
     * @param {Event} event - 拖放事件
     */
    function insertDroppedImage(dataUrl, event) {
        let target = event.target;
        while (target && !target.classList.contains('entry-content')) {
            target = target.parentElement;
        }
        
        if (target) {
            const figureHTML = `
                <div class="figure-container">
                    <div class="figure medium">
                        <img src="${dataUrl}" alt="拖放的图片">
                        <div class="figure-caption">
                            <span class="figure-label">Figure X.X</span> 添加图片说明...
                        </div>
                    </div>
                </div>
            `;
            
            const figureElement = createElementFromHTML(figureHTML);
            target.appendChild(figureElement);
            
            JournalStorage.saveToLocalStorage();
        }
    }

    /**
     * 设置拖放功能
     */
    function setupDragAndDrop() {
        document.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        document.addEventListener('drop', function(e) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            
            if (files.length > 0) {
                const file = files[0];
                
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const coverPage = $('.cover-page');
                        const rect = coverPage.getBoundingClientRect();
                        
                        if (e.clientY < rect.bottom) {
                            // 拖到封面区域，更换封面
                            $('.cover-image').src = event.target.result;
                            JournalStorage.saveToLocalStorage();
                        } else {
                            // 拖到其他区域，插入到内容
                            insertDroppedImage(event.target.result, e);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }

    /**
     * 初始化媒体模块
     */
    function init() {
        setupDragAndDrop();
    }

    // 公开API
    return {
        confirmInsertMedia,
        insertDroppedImage,
        init
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalMedia;
}
