/**
 * PaperNotes - Render Module
 * Page rendering functions
 */

const Render = {
    // SVG Icons
    icons: {
        plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        book: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },

    /**
     * Render Level 1 - Main categories (Parts)
     */
    level1() {
        const { AppState, UI, CATEGORY_STRUCTURE } = window.PaperNotes;
        
        AppState.setCurrentLevel([]);
        UI.updateBreadcrumb([]);
        UI.setDefaultHeaderButtons();
        
        const html = `
            <div class="level-grid">
                ${Object.keys(CATEGORY_STRUCTURE).map(part => {
                    const count = Object.keys(CATEGORY_STRUCTURE[part]).reduce((sum, chapter) => 
                        sum + CATEGORY_STRUCTURE[part][chapter].length, 0);
                    return `
                        <div class="level-card" onclick="PaperNotes.App.navigateToLevel2('${UI.escapeAttr(part)}')">
                            <h3>${part}</h3>
                            <div class="count">${count} 个子类别</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        UI.setContent(html);
    },
    
    /**
     * Render Level 2 - Subcategories within a part
     * @param {string} part - The selected part name
     */
    level2(part) {
        const { AppState, UI, CATEGORY_STRUCTURE } = window.PaperNotes;
        
        AppState.setCurrentLevel([part]);
        UI.updateBreadcrumb([part]);
        UI.setDefaultHeaderButtons();
        
        const chapters = CATEGORY_STRUCTURE[part];
        
        let html = '<div class="level-grid">';
        for (const [chapter, subcategories] of Object.entries(chapters)) {
            for (const subcategory of subcategories) {
                const paperCount = AppState.getPaperCount(subcategory);
                html += `
                    <div class="level-card" onclick="PaperNotes.App.navigateToPaperList('${UI.escapeAttr(part)}', '${UI.escapeAttr(chapter)}', '${UI.escapeAttr(subcategory)}')">
                        <h3>${subcategory}</h3>
                        <div class="count">${paperCount} 篇论文</div>
                    </div>
                `;
            }
        }
        html += '</div>';
        
        UI.setContent(html);
    },
    
    /**
     * Render paper list for a subcategory
     * @param {string} part - Part name
     * @param {string} chapter - Chapter name
     * @param {string} subcategory - Subcategory name
     */
    paperList(part, chapter, subcategory) {
        const { AppState, UI } = window.PaperNotes;
        
        AppState.setCurrentLevel([part, chapter, subcategory]);
        AppState.setCurrentSubcategory(subcategory);
        UI.updateBreadcrumb([part, chapter, subcategory]);
        UI.setDefaultHeaderButtons();
        
        const paperList = AppState.getPapersForSubcategory(subcategory);
        
        let html = `
            <div class="action-bar">
                <div class="search-box">
                    <input type="text" placeholder="搜索论文..." id="searchInput" oninput="PaperNotes.App.filterPapers()">
                </div>
                <button class="btn btn-primary" onclick="PaperNotes.App.openAddPaperModal()">${this.icons.plus} 添加论文</button>
            </div>
        `;
        
        if (paperList.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">${this.icons.book}</div>
                    <div class="empty-state-text">还没有添加论文笔记</div>
                    <div class="empty-state-subtext">点击上方按钮开始添加您的第一篇论文笔记</div>
                </div>
            `;
        } else {
            html += '<div id="paperListContainer">';
            paperList.forEach((paper, index) => {
                html += `
                    <div class="paper-item" data-title="${UI.escapeAttr(paper.title.toLowerCase())}" data-authors="${UI.escapeAttr(paper.authors.toLowerCase())}">
                        <div class="paper-header" onclick="PaperNotes.App.navigateToPaperDetail(${index})">
                            <div class="paper-number">${index + 1}</div>
                            <div class="paper-info">
                                <div class="paper-title">${UI.escapeHtml(paper.title)}</div>
                                <div class="paper-meta">${UI.escapeHtml(paper.authors)} • ${paper.year}</div>
                            </div>
                        </div>
                        <div class="paper-summary" onclick="PaperNotes.App.navigateToPaperDetail(${index})">
                            ${UI.escapeHtml(paper.summary)}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        UI.setContent(html);
    },
    
    /**
     * Render paper detail view
     * @param {number} index - Paper index
     */
    paperDetail(index) {
        const { AppState, UI, MarkdownParser } = window.PaperNotes;
        
        const subcategory = AppState.getCurrentSubcategory();
        const paper = AppState.getPaper(subcategory, index);
        
        if (!paper) {
            console.error('Paper not found:', subcategory, index);
            return;
        }
        
        UI.updateBreadcrumb(AppState.getCurrentLevel(), paper.title);
        UI.setDetailHeaderButtons(paper, index);
        
        const html = `
            <div class="paper-detail">
                <div class="detail-content" id="noteContent">
                    ${MarkdownParser.parse(paper.notes || '暂无笔记内容')}
                </div>
            </div>
        `;
        
        UI.setContent(html);
        
        // Render MathJax
        const noteContent = document.getElementById('noteContent');
        if (noteContent) {
            MarkdownParser.renderMath(noteContent);
        }
    },
    
    /**
     * Filter papers based on search input
     */
    filterPapers() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const paperItems = document.querySelectorAll('.paper-item');
        
        paperItems.forEach(item => {
            const title = item.getAttribute('data-title') || '';
            const authors = item.getAttribute('data-authors') || '';
            
            if (title.includes(searchTerm) || authors.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.Render = Render;
