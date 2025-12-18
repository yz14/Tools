/**
 * PaperNotes - UI Utilities
 * Modal, sidebar, breadcrumb, and other UI operations
 */

const UI = {
    // DOM element references (cached for performance)
    elements: {
        content: null,
        breadcrumb: null,
        pageTitle: null,
        modal: null,
        modalContent: null,
        modalHeader: null,
        form: null,
        leftSidebar: null,
        rightSidebar: null,
        headerButtonGroup: null,
        importFile: null
    },
    
    /**
     * Initialize UI by caching DOM references
     */
    init() {
        this.elements = {
            content: document.getElementById('content'),
            breadcrumb: document.getElementById('breadcrumb'),
            pageTitle: document.getElementById('pageTitle'),
            modal: document.getElementById('addPaperModal'),
            modalContent: document.querySelector('.modal-content'),
            modalHeader: document.querySelector('.modal-header'),
            form: document.getElementById('addPaperForm'),
            leftSidebar: document.getElementById('leftSidebar'),
            rightSidebar: document.getElementById('rightSidebar'),
            headerButtonGroup: document.querySelector('.header .btn-group'),
            importFile: document.getElementById('importFile')
        };
    },
    
    // ========== Breadcrumb ==========
    
    /**
     * Update breadcrumb navigation
     * @param {Array} currentLevel - Current navigation path
     * @param {string} paperTitle - Optional paper title for detail view
     */
    updateBreadcrumb(currentLevel, paperTitle = null) {
        const { breadcrumb, pageTitle } = this.elements;
        
        if (currentLevel.length === 0) {
            breadcrumb.innerHTML = '';
            pageTitle.textContent = 'Paper Notes';
            return;
        }
        
        let html = '<span class="breadcrumb-item" onclick="PaperNotes.App.navigateToLevel1()">首页</span>';
        
        currentLevel.forEach((level, index) => {
            html += '<span class="breadcrumb-separator">›</span>';
            
            if (index === 0) {
                html += `<span class="breadcrumb-item" onclick="PaperNotes.App.navigateToLevel2('${this.escapeAttr(level)}')">${level}</span>`;
            } else if (index === 1) {
                html += `<span class="breadcrumb-item" onclick="PaperNotes.App.navigateToLevel2('${this.escapeAttr(currentLevel[0])}')">${level}</span>`;
            } else if (index === 2) {
                html += `<span class="breadcrumb-item" onclick="PaperNotes.App.navigateToPaperList('${this.escapeAttr(currentLevel[0])}', '${this.escapeAttr(currentLevel[1])}', '${this.escapeAttr(currentLevel[2])}')">${level}</span>`;
            } else {
                html += `<span class="breadcrumb-item">${level}</span>`;
            }
        });
        
        breadcrumb.innerHTML = html;
        pageTitle.textContent = paperTitle || currentLevel[currentLevel.length - 1];
    },
    
    // ========== Header Buttons ==========
    
    // SVG Icons
    icons: {
        download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        upload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
        users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        fileText: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    },

    /**
     * Set header buttons to default (export/import)
     */
    setDefaultHeaderButtons() {
        this.elements.headerButtonGroup.innerHTML = `
            <button class="btn btn-secondary" onclick="PaperNotes.App.exportData()">${this.icons.download} 导出</button>
            <button class="btn btn-secondary" onclick="PaperNotes.App.importData()">${this.icons.upload} 导入</button>
        `;
    },
    
    /**
     * Set header buttons for paper detail view
     * @param {Object} paper - Paper object
     * @param {number} index - Paper index
     */
    setDetailHeaderButtons(paper, index) {
        this.elements.headerButtonGroup.innerHTML = `
            <div class="detail-meta-item">
                ${this.icons.users} ${this.escapeHtml(paper.authors)}
            </div>
            <div class="detail-meta-item">
                ${this.icons.calendar} ${paper.year}
            </div>
            ${paper.url ? `<a href="${this.escapeAttr(paper.url)}" target="_blank" class="link-button">${this.icons.link} 原文</a>` : ''}
            <button class="btn btn-secondary" onclick="PaperNotes.App.openEditMetadataModal(${index})">${this.icons.edit} 编辑信息</button>
            <button class="btn btn-secondary" onclick="PaperNotes.App.openEditNotesModal(${index})">${this.icons.fileText} 编辑笔记</button>
            <button class="btn btn-danger" onclick="PaperNotes.App.deletePaper(${index})">${this.icons.trash} 删除</button>
        `;
    },
    
    // ========== Modal ==========
    
    /**
     * Open the add/edit paper modal
     */
    openModal() {
        this.elements.modal.classList.add('active');
    },
    
    /**
     * Close the modal and reset form
     */
    closeModal() {
        const { modal, modalContent, modalHeader, form } = this.elements;
        
        modal.classList.remove('active');
        form.reset();
        
        // Remove fullscreen styles
        modalContent.classList.remove('fullscreen');
        document.getElementById('paperNotes').classList.remove('fullscreen-textarea');
        
        // Clear edit mode data
        delete form.dataset.editIndex;
        delete form.dataset.editType;
        
        // Restore all form groups visibility
        const groups = ['titleGroup', 'authorsGroup', 'yearGroup', 'urlGroup', 'summaryGroup', 'notesGroup'];
        groups.forEach(id => {
            document.getElementById(id).style.display = 'block';
        });
        
        // Restore modal header
        modalHeader.textContent = '添加论文笔记';
        modalHeader.style.display = 'block';
        
        // Hide sidebars
        this.hideSidebars();
    },
    
    /**
     * Configure modal for adding a new paper
     */
    configureModalForAdd() {
        this.openModal();
        this.elements.form.reset();
        this.showSidebars();
    },
    
    /**
     * Configure modal for editing metadata only
     * @param {Object} paper - Paper to edit
     * @param {number} index - Paper index
     */
    configureModalForMetadata(paper, index) {
        this.openModal();
        
        // Fill form with paper data
        document.getElementById('paperTitle').value = paper.title;
        document.getElementById('paperAuthors').value = paper.authors;
        document.getElementById('paperYear').value = paper.year;
        document.getElementById('paperUrl').value = paper.url || '';
        document.getElementById('paperSummary').value = paper.summary;
        document.getElementById('paperNotes').value = paper.notes || '';
        
        // Hide notes field
        document.getElementById('notesGroup').style.display = 'none';
        
        // Set edit mode
        this.elements.form.dataset.editIndex = index;
        this.elements.form.dataset.editType = 'metadata';
        this.elements.modalHeader.textContent = '编辑论文信息';
    },
    
    /**
     * Configure modal for editing notes only (fullscreen)
     * @param {Object} paper - Paper to edit
     * @param {number} index - Paper index
     */
    configureModalForNotes(paper, index) {
        this.openModal();
        
        // Fill form with paper data
        document.getElementById('paperTitle').value = paper.title;
        document.getElementById('paperAuthors').value = paper.authors;
        document.getElementById('paperYear').value = paper.year;
        document.getElementById('paperUrl').value = paper.url || '';
        document.getElementById('paperSummary').value = paper.summary;
        document.getElementById('paperNotes').value = paper.notes || '';
        
        // Hide metadata fields
        const metaGroups = ['titleGroup', 'authorsGroup', 'yearGroup', 'urlGroup', 'summaryGroup'];
        metaGroups.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        
        // Set edit mode
        this.elements.form.dataset.editIndex = index;
        this.elements.form.dataset.editType = 'notes';
        this.elements.modalHeader.style.display = 'none';
        
        // Add fullscreen styles
        this.elements.modalContent.classList.add('fullscreen');
        document.getElementById('paperNotes').classList.add('fullscreen-textarea');
        
        this.showSidebars();
    },
    
    /**
     * Get form data
     * @returns {Object} Paper object from form
     */
    getFormData() {
        return {
            title: document.getElementById('paperTitle').value,
            authors: document.getElementById('paperAuthors').value,
            year: parseInt(document.getElementById('paperYear').value),
            url: document.getElementById('paperUrl').value,
            summary: document.getElementById('paperSummary').value,
            notes: document.getElementById('paperNotes').value
        };
    },
    
    /**
     * Get edit mode info
     * @returns {Object} { editIndex, editType } or null if not in edit mode
     */
    getEditMode() {
        const { form } = this.elements;
        const editIndex = form.dataset.editIndex;
        
        if (editIndex !== undefined) {
            return {
                editIndex: parseInt(editIndex),
                editType: form.dataset.editType
            };
        }
        return null;
    },
    
    // ========== Sidebars ==========
    
    /**
     * Show both sidebars
     */
    showSidebars() {
        this.elements.leftSidebar.classList.add('active');
        this.elements.rightSidebar.classList.add('active');
        document.body.classList.add('sidebars-active');
    },
    
    /**
     * Hide both sidebars
     */
    hideSidebars() {
        this.elements.leftSidebar.classList.remove('active');
        this.elements.rightSidebar.classList.remove('active');
        document.body.classList.remove('sidebars-active');
    },
    
    /**
     * Toggle a toolbar section collapse state
     * @param {HTMLElement} label - The clicked label element
     */
    toggleSection(label) {
        const content = label.nextElementSibling;
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            content.classList.remove('collapsed');
            label.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            label.classList.add('collapsed');
        }
    },
    
    /**
     * Insert text at cursor position in textarea
     * Smart cursor positioning: places cursor inside first empty {} or at end
     * @param {string} text - Text to insert
     */
    insertText(text) {
        const textarea = document.getElementById('paperNotes');
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;
        
        textarea.value = currentValue.substring(0, start) + text + currentValue.substring(end);
        
        // Smart cursor positioning: find first empty {} and position cursor inside
        const emptyBracesIndex = text.indexOf('{}');
        const emptyParensIndex = text.indexOf('()');
        const emptySquareIndex = text.indexOf('[]');
        
        let cursorOffset = text.length;
        
        // Find the first empty placeholder
        const placeholders = [
            { index: emptyBracesIndex, offset: 1 },
            { index: emptyParensIndex, offset: 1 },
            { index: emptySquareIndex, offset: 1 }
        ].filter(p => p.index !== -1);
        
        if (placeholders.length > 0) {
            // Get the earliest placeholder
            placeholders.sort((a, b) => a.index - b.index);
            cursorOffset = placeholders[0].index + placeholders[0].offset;
        } else if (text.includes('***  ***')) {
            // For bold-italic text with spaces
            cursorOffset = text.indexOf('***  ***') + 4;
        } else if (text.includes('**  **')) {
            // For bold text with spaces
            cursorOffset = text.indexOf('**  **') + 3;
        } else if (text.includes('*  *')) {
            // For italic text with spaces
            cursorOffset = text.indexOf('*  *') + 2;
        } else if (text.includes('$  $')) {
            // For inline math with spaces, position between spaces
            cursorOffset = text.indexOf('$  $') + 2;
        } else if (text.includes('`  `')) {
            // For inline code with spaces
            cursorOffset = text.indexOf('`  `') + 2;
        }
        
        const newPos = start + cursorOffset;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
    },
    
    // ========== Import File ==========
    
    /**
     * Trigger file import dialog
     */
    triggerImport() {
        this.elements.importFile.click();
    },
    
    /**
     * Reset import file input
     */
    resetImportInput() {
        this.elements.importFile.value = '';
    },
    
    // ========== Utility ==========
    
    /**
     * Set content area HTML
     * @param {string} html - HTML content
     */
    setContent(html) {
        this.elements.content.innerHTML = html;
    },
    
    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Escape attribute value
     */
    escapeAttr(text) {
        if (!text) return '';
        return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.UI = UI;

// Global functions for onclick handlers in HTML
window.toggleSection = (label) => UI.toggleSection(label);
window.insertText = (text) => UI.insertText(text);
