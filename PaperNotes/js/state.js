/**
 * PaperNotes - State Management
 * Centralized state management for the application
 */

const AppState = {
    // Current navigation path
    currentLevel: [],
    
    // Current subcategory being viewed
    currentSubcategory: null,
    
    // All papers data (keyed by subcategory)
    papers: {},
    
    // Getters
    getCurrentLevel() {
        return [...this.currentLevel];
    },
    
    getCurrentSubcategory() {
        return this.currentSubcategory;
    },
    
    getPapers() {
        return this.papers;
    },
    
    getPapersForSubcategory(subcategory) {
        return this.papers[subcategory] || [];
    },
    
    getPaper(subcategory, index) {
        const papers = this.papers[subcategory];
        return papers ? papers[index] : null;
    },
    
    // Setters
    setCurrentLevel(level) {
        this.currentLevel = [...level];
    },
    
    pushLevel(item) {
        this.currentLevel.push(item);
    },
    
    popLevel() {
        return this.currentLevel.pop();
    },
    
    setCurrentSubcategory(subcategory) {
        this.currentSubcategory = subcategory;
    },
    
    setPapers(papers) {
        this.papers = papers || {};
    },
    
    // Paper operations
    addPaper(subcategory, paper) {
        if (!this.papers[subcategory]) {
            this.papers[subcategory] = [];
        }
        this.papers[subcategory].push(paper);
        return this.papers[subcategory].length - 1; // Return new index
    },
    
    updatePaper(subcategory, index, paper) {
        if (this.papers[subcategory] && this.papers[subcategory][index]) {
            const oldPaper = { ...this.papers[subcategory][index] };
            this.papers[subcategory][index] = paper;
            return oldPaper; // Return old paper for potential rollback
        }
        return null;
    },
    
    deletePaper(subcategory, index) {
        if (this.papers[subcategory]) {
            const deleted = this.papers[subcategory].splice(index, 1);
            return deleted[0];
        }
        return null;
    },
    
    getPaperCount(subcategory) {
        return this.papers[subcategory] ? this.papers[subcategory].length : 0;
    },
    
    getTotalPaperCount() {
        return Object.values(this.papers).reduce((sum, arr) => sum + arr.length, 0);
    },
    
    // Reset state
    reset() {
        this.currentLevel = [];
        this.currentSubcategory = null;
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.AppState = AppState;
