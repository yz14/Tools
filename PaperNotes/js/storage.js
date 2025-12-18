/**
 * PaperNotes - Storage Module
 * Handles data persistence (localStorage or window.storage)
 */

const Storage = {
    STORAGE_KEY: 'papers',
    
    /**
     * Load papers from storage
     * @returns {Promise<Object>} Papers data object
     */
    async load() {
        try {
            if (window.storage) {
                // Use window.storage API if available
                const stored = await window.storage.get(this.STORAGE_KEY);
                if (stored && stored.value) {
                    return JSON.parse(stored.value);
                }
            } else {
                // Fallback to localStorage
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    return JSON.parse(stored);
                }
            }
        } catch (error) {
            console.error('Error loading papers:', error);
        }
        return {};
    },
    
    /**
     * Save papers to storage
     * @param {Object} papers - Papers data to save
     * @returns {Promise<boolean>} Success status
     */
    async save(papers) {
        try {
            const dataStr = JSON.stringify(papers);
            
            if (window.storage) {
                const result = await window.storage.set(this.STORAGE_KEY, dataStr);
                if (!result) {
                    throw new Error('Storage save failed');
                }
                return true;
            } else {
                localStorage.setItem(this.STORAGE_KEY, dataStr);
                return true;
            }
        } catch (error) {
            console.error('Error saving papers:', error);
            alert('保存失败：' + error.message);
            return false;
        }
    },
    
    /**
     * Export papers to JSON file
     * @param {Object} papers - Papers data to export
     */
    exportToFile(papers) {
        const dataStr = JSON.stringify(papers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `papers_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    },
    
    /**
     * Import papers from JSON file
     * @param {File} file - File to import
     * @returns {Promise<Object>} Imported papers data
     */
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('文件格式错误'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };
            
            reader.readAsText(file);
        });
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.Storage = Storage;
