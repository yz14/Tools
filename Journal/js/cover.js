/**
 * cover.js - 封面模块
 * 管理封面图片的设置和更换
 */

const JournalCover = (function() {
    const { $ } = JournalUtils;

    /**
     * 设置封面图片交互
     */
    function setup() {
        const coverImage = $('.cover-image');
        const coverPage = $('.cover-page');
        
        if (!coverPage) return;
        
        // 双击封面可以更换图片
        coverPage.addEventListener('dblclick', function(e) {
            if (e.target === coverPage || e.target.classList.contains('cover-content')) {
                selectCoverImage();
            }
        });
    }

    /**
     * 选择封面图片
     */
    function selectCoverImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                setCoverImage(event.target.result);
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    }

    /**
     * 设置封面图片
     * @param {string} src - 图片源
     */
    function setCoverImage(src) {
        const coverImage = $('.cover-image');
        if (coverImage) {
            coverImage.src = src;
            coverImage.style.display = 'block';
            JournalStorage.saveToLocalStorage();
        }
    }

    /**
     * 获取封面图片源
     * @returns {string}
     */
    function getCoverImage() {
        const coverImage = $('.cover-image');
        return coverImage ? coverImage.src : '';
    }

    // 公开API
    return {
        setup,
        selectCoverImage,
        setCoverImage,
        getCoverImage
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JournalCover;
}
