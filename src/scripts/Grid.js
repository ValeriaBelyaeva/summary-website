/**
 * @fileoverview Manages the creation and state of the background grid.
 * This version draws the entire grid statically on initialization
 * but is structured to support future animation.
 */

export class Grid {
    /**
     * Creates an instance of the Grid.
     * @param {object} options - Configuration options for the grid.
     */
    constructor(options = {}) {
        this.options = {
            lineColor: '#1E1E1E', // COLOR_GRID_LINE
            lineWidth: 1,
            ...options
        };
        this.canvas = null;
        this.ctx = null;
        this.gridSegments = []; // Will store all line segments [x1, y1, x2, y2]
    }

    /**
     * Initializes the grid canvas and performs the initial static draw.
     * @param {HTMLElement} container - The element to append the canvas to.
     */
    init(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute'; // Absolute to scroll with the page
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1'; // Behind all content
        container.prepend(this.canvas); // Prepend to be behind other children
        
        this.ctx = this.canvas.getContext('2d');
        
        this.onResize(); // Set initial size
    }

    /**
     * Calculates all segments from component bounding boxes and triggers a redraw.
     * This is the main method to generate the grid geometry.
     * @param {Array<HTMLElement>} components - An array of all rendered component elements.
     */
    buildFromComponents(components) {
        this.gridSegments = []; // Clear previous segments
        const viewportWidth = document.documentElement.clientWidth;

        components.forEach(el => {
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const bottom = rect.bottom + window.scrollY;
            const left = rect.left + window.scrollX;
            const right = rect.right + window.scrollX;

            // Add segments for the component's bounding box
            // We ensure no duplicate lines are added by checking existence later,
            // but for now, we just add all logical lines.
            this.gridSegments.push([left, top, right, top]); // Top line
            this.gridSegments.push([left, bottom, right, bottom]); // Bottom line
            this.gridSegments.push([left, top, left, bottom]); // Left line
            this.gridSegments.push([right, top, right, bottom]); // Right line
        });
        
        // Connect to screen edges if needed
        const headerRect = components[0].getBoundingClientRect();
        this.gridSegments.push([0, headerRect.bottom + window.scrollY, viewportWidth, headerRect.bottom + window.scrollY]);

        this.draw(); // Draw the newly calculated grid
    }

    /**
     * Draws all stored grid segments onto the canvas at once.
     * In an animated version, this would be inside a requestAnimationFrame loop.
     */
    draw() {
        if (!this.ctx) return;
        
        // Clear previous drawing
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = this.options.lineWidth;
        
        this.ctx.beginPath();
        this.gridSegments.forEach(([x1, y1, x2, y2]) => {
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        });
        this.ctx.stroke();
    }
    
    /**
     * Checks if a given rectangular area is fully encompassed by the grid.
     * This is the "hook" for future animation checks.
     * @param {DOMRect} rect - The bounding rectangle of a component to check.
     * @returns {boolean} - For this static version, it always returns true.
     */
    isAreaReady(rect) {
        // In a dynamic version, we would check if the lines around this rect
        // have finished their "growing" animation.
        // For now, since the grid is drawn instantly, any area is always "ready".
        return true;
    }

    /**
     * Handles window resize event.
     * Recalculates canvas size and triggers a redraw.
     */
    onResize() {
        // Set canvas size to match the entire document scrollable area
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;
        
        // A redraw would be needed if components are rebuilt on resize
        // For now, we just ensure canvas is correctly sized.
        this.draw();
    }
}