/**
 * PaperNotes - Main Application
 * App initialization and event handlers
 */

const App = {
    /**
     * Initialize the application
     */
    async init() {
        const { AppState, Storage, UI, Render, generateToolbarHTML } = window.PaperNotes;
        
        // Initialize UI
        UI.init();
        
        // Generate toolbar HTML dynamically
        document.getElementById('leftSidebar').innerHTML = `
            <div class="sidebar-header">常用符号</div>
            ${generateToolbarHTML('left')}
        `;
        document.getElementById('rightSidebar').innerHTML = `
            <div class="sidebar-header">常用模板</div>
            ${generateToolbarHTML('right')}
        `;
        
        // Load saved papers
        const papers = await Storage.load();
        AppState.setPapers(papers);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        Render.level1();
    },
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        const { UI, AppState, Storage, Render } = window.PaperNotes;
        
        // Form submit
        document.getElementById('addPaperForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit();
        });
        
        // Import file change
        document.getElementById('importFile').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const importedData = await Storage.importFromFile(file);
                
                if (confirm('导入将覆盖现有数据，是否继续？')) {
                    AppState.setPapers(importedData);
                    await Storage.save(AppState.getPapers());
                    alert('导入成功！');
                    Render.level1();
                }
            } catch (error) {
                alert('导入失败：' + error.message);
                console.error(error);
            }
            
            UI.resetImportInput();
        });
        
        // Modal background click to close
        document.getElementById('addPaperModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('addPaperModal')) {
                UI.closeModal();
            }
        });
    },
    
    // ========== Navigation ==========
    
    navigateToLevel1() {
        window.PaperNotes.Render.level1();
    },
    
    navigateToLevel2(part) {
        window.PaperNotes.Render.level2(part);
    },
    
    navigateToPaperList(part, chapter, subcategory) {
        window.PaperNotes.Render.paperList(part, chapter, subcategory);
    },
    
    navigateToPaperDetail(index) {
        window.PaperNotes.Render.paperDetail(index);
    },
    
    // ========== Paper Operations ==========
    
    filterPapers() {
        window.PaperNotes.Render.filterPapers();
    },
    
    openAddPaperModal() {
        window.PaperNotes.UI.configureModalForAdd();
    },
    
    openEditMetadataModal(index) {
        const { AppState, UI } = window.PaperNotes;
        const paper = AppState.getPaper(AppState.getCurrentSubcategory(), index);
        if (paper) {
            UI.configureModalForMetadata(paper, index);
        }
    },
    
    openEditNotesModal(index) {
        const { AppState, UI } = window.PaperNotes;
        const paper = AppState.getPaper(AppState.getCurrentSubcategory(), index);
        if (paper) {
            UI.configureModalForNotes(paper, index);
        }
    },
    
    async deletePaper(index) {
        if (!confirm('确定要删除这篇论文笔记吗？')) {
            return;
        }
        
        const { AppState, Storage, Render, UI } = window.PaperNotes;
        const subcategory = AppState.getCurrentSubcategory();
        
        AppState.deletePaper(subcategory, index);
        await Storage.save(AppState.getPapers());
        
        // Navigate back to paper list
        const currentLevel = AppState.getCurrentLevel();
        AppState.popLevel(); // Remove paper title from level
        Render.paperList(currentLevel[0], currentLevel[1], subcategory);
    },
    
    async handleFormSubmit() {
        const { AppState, Storage, UI, Render } = window.PaperNotes;
        
        const paper = UI.getFormData();
        const editMode = UI.getEditMode();
        const subcategory = AppState.getCurrentSubcategory();
        
        if (editMode) {
            // Edit mode
            const oldPaper = AppState.updatePaper(subcategory, editMode.editIndex, paper);
            const saved = await Storage.save(AppState.getPapers());
            
            if (saved) {
                UI.closeModal();
                Render.paperDetail(editMode.editIndex);
            } else {
                // Rollback on failure
                AppState.updatePaper(subcategory, editMode.editIndex, oldPaper);
            }
        } else {
            // Add mode
            const newIndex = AppState.addPaper(subcategory, paper);
            const saved = await Storage.save(AppState.getPapers());
            
            if (saved) {
                UI.closeModal();
                const currentLevel = AppState.getCurrentLevel();
                Render.paperList(currentLevel[0], currentLevel[1], subcategory);
            } else {
                // Rollback on failure
                AppState.deletePaper(subcategory, newIndex);
            }
        }
    },
    
    // ========== Import/Export ==========
    
    exportData() {
        const { AppState, Storage } = window.PaperNotes;
        Storage.exportToFile(AppState.getPapers());
    },
    
    importData() {
        window.PaperNotes.UI.triggerImport();
    },
    
    // ========== Modal ==========
    
    closeModal() {
        window.PaperNotes.UI.closeModal();
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.App = App;

// Global function for close modal (used in HTML)
window.closeModal = () => App.closeModal();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
