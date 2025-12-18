/**
 * PaperNotes - Markdown Parser
 * Simple Markdown to HTML converter with LaTeX formula preservation
 */

const MarkdownParser = {
    /**
     * Parse Markdown text to HTML
     * Preserves LaTeX formulas and handles common Markdown syntax
     * @param {string} text - Markdown text to parse
     * @returns {string} HTML output
     */
    parse(text) {
        if (!text) return '';
        
        // Step 1: Protect math formulas from being processed
        const { text: protectedText, blocks, inlines } = this.protectMath(text);
        
        // Step 2: Process Markdown syntax
        let html = this.processMarkdown(protectedText);
        
        // Step 3: Restore math formulas
        html = this.restoreMath(html, blocks, inlines);
        
        return html;
    },
    
    /**
     * Protect math formulas by replacing them with placeholders
     */
    protectMath(text) {
        const blocks = [];
        const inlines = [];
        
        // Protect block-level formulas $$...$$
        text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
            blocks.push(match);
            return `__MATH_BLOCK_${blocks.length - 1}__`;
        });
        
        // Protect inline formulas $...$
        text = text.replace(/\$([^\$\n]+?)\$/g, (match) => {
            inlines.push(match);
            return `__MATH_INLINE_${inlines.length - 1}__`;
        });
        
        return { text, blocks, inlines };
    },
    
    /**
     * Restore math formulas from placeholders
     */
    restoreMath(html, blocks, inlines) {
        // Restore block formulas
        blocks.forEach((math, index) => {
            html = html.replace(`__MATH_BLOCK_${index}__`, math);
        });
        
        // Restore inline formulas
        inlines.forEach((math, index) => {
            html = html.replace(`__MATH_INLINE_${index}__`, math);
        });
        
        return html;
    },
    
    /**
     * Process Markdown syntax
     */
    processMarkdown(text) {
        // Split into lines for processing
        let lines = text.split('\n');
        let result = [];
        let inList = false;
        let listItems = [];
        let inCodeBlock = false;
        let codeBlockContent = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Handle code blocks ```...```
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    // End code block
                    result.push('<pre><code>' + this.escapeHtml(codeBlockContent.join('\n')) + '</code></pre>');
                    codeBlockContent = [];
                    inCodeBlock = false;
                } else {
                    // Flush any pending list
                    if (inList) {
                        result.push('<ul>' + listItems.join('') + '</ul>');
                        listItems = [];
                        inList = false;
                    }
                    // Start code block
                    inCodeBlock = true;
                }
                continue;
            }
            
            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }
            
            // Handle headers
            if (line.startsWith('### ')) {
                if (inList) {
                    result.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                result.push('<h3>' + this.processInline(line.substring(4)) + '</h3>');
                continue;
            }
            
            if (line.startsWith('## ')) {
                if (inList) {
                    result.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                result.push('<h2>' + this.processInline(line.substring(3)) + '</h2>');
                continue;
            }
            
            // Handle unordered list items
            if (line.match(/^[\-\*]\s+/)) {
                inList = true;
                const content = line.replace(/^[\-\*]\s+/, '');
                listItems.push('<li>' + this.processInline(content) + '</li>');
                continue;
            }
            
            // Handle ordered list items
            if (line.match(/^\d+\.\s+/)) {
                // For simplicity, treat as unordered list
                // Could be enhanced to handle ordered lists separately
                inList = true;
                const content = line.replace(/^\d+\.\s+/, '');
                listItems.push('<li>' + this.processInline(content) + '</li>');
                continue;
            }
            
            // End list if we hit a non-list line
            if (inList && line.trim() !== '') {
                result.push('<ul>' + listItems.join('') + '</ul>');
                listItems = [];
                inList = false;
            }
            
            // Handle empty lines
            if (line.trim() === '') {
                if (inList) {
                    result.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                result.push('');
                continue;
            }
            
            // Handle math placeholder lines (don't wrap in <p>)
            if (line.includes('__MATH_BLOCK_')) {
                result.push(line);
                continue;
            }
            
            // Regular paragraph
            result.push('<p>' + this.processInline(line) + '</p>');
        }
        
        // Flush any remaining list
        if (inList) {
            result.push('<ul>' + listItems.join('') + '</ul>');
        }
        
        // Flush any unclosed code block
        if (inCodeBlock) {
            result.push('<pre><code>' + this.escapeHtml(codeBlockContent.join('\n')) + '</code></pre>');
        }
        
        return result.join('\n');
    },
    
    /**
     * Process inline Markdown syntax (bold, italic, code, etc.)
     */
    processInline(text) {
        // Inline code (must be before bold/italic to avoid conflicts)
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold
        text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
        
        // Links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Images ![alt](url)
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        return text;
    },
    
    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, char => escapeMap[char]);
    },
    
    /**
     * Trigger MathJax to render formulas in a container
     * @param {HTMLElement} container - DOM element containing formulas
     */
    renderMath(container) {
        if (window.MathJax && window.MathJax.typesetPromise) {
            setTimeout(() => {
                MathJax.typesetPromise([container]).catch(err => {
                    console.error('MathJax rendering error:', err);
                });
            }, 100);
        }
    }
};

// Export
window.PaperNotes = window.PaperNotes || {};
window.PaperNotes.MarkdownParser = MarkdownParser;
