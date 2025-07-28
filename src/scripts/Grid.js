/**
 * @fileoverview Manages the creation and DYNAMIC animation of the background grid.
 * This is the final, functional implementation.
 */

// Enum for the state of each line segment
const SEGMENT_STATE = {
    PENDING: 0,   // Scheduled for drawing, not yet started
    DRAWING: 1,   // Currently being animated
    FINISHED: 2,  // Animation complete, fully visible
    ERASING: 3,   // Being erased (animated in reverse)
};

export class Grid {
    /**
     * Creates an instance of the Grid animation controller.
     * @param {object} options - Configuration options.
     * @param {number} options.drawingSpeed - Speed of line drawing in pixels per second.
     */
    constructor(options = {}) {
        this.options = {
            drawingSpeed: 400, // Default speed: 400px per second
            lineColor: '#1E1E1E',
            lineWidth: 1,
            ...options,
        };
        
        this.canvas = null;
        this.ctx = null;
        
        // The core state management object. Maps a unique ID to a segment's state.
        this.segments = new Map();

        this.lastTimestamp = 0;
        this.isAnimationLoopRunning = false;
    }

    /**
     * Initializes the canvas and starts the animation loop.
     * @param {HTMLElement} container - The element to append the canvas to.
     */
    init(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        container.prepend(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.onResize();

        this.startAnimationLoop();
    }

    /**
     * The main animation loop, powered by requestAnimationFrame.
     * @param {number} timestamp - The current time provided by the browser.
     */
    animationLoop(timestamp) {
        if (!this.isAnimationLoopRunning) return;

        const deltaTime = (timestamp - this.lastTimestamp) || 0;
        this.lastTimestamp = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = this.options.lineWidth;
        
        for (const segment of this.segments.values()) {
            this.updateSegment(segment, deltaTime);
            this.drawSegment(segment);
        }

        requestAnimationFrame((ts) => this.animationLoop(ts));
    }
    
    /**
     * Updates a single segment's properties based on its state and delta time.
     * @param {object} segment - The segment state object.
     * @param {number} deltaTime - Time elapsed since the last frame in milliseconds.
     */
    updateSegment(segment, deltaTime) {
        const growth = (deltaTime / 1000) * this.options.drawingSpeed;

        if (segment.state === SEGMENT_STATE.DRAWING) {
            segment.currentLength += growth;
            if (segment.currentLength >= segment.length) {
                segment.currentLength = segment.length;
                segment.state = SEGMENT_STATE.FINISHED;
            }
        } else if (segment.state === SEGMENT_STATE.ERASING) {
            segment.currentLength -= growth * 1.25; // Erase 25% faster
            if (segment.currentLength <= 0) {
                this.segments.delete(segment.id); // Remove completely
            }
        }
    }

    /**
     * Renders a single segment on the canvas based on its current length.
     * @param {object} segment - The segment to draw.
     */
    drawSegment(segment) {
        if (segment.currentLength <= 0) return;

        const ratio = segment.length > 0 ? segment.currentLength / segment.length : 1;
        
        const currentX = segment.x1 + (segment.x2 - segment.x1) * ratio;
        const currentY = segment.y1 + (segment.y2 - segment.y1) * ratio;

        this.ctx.beginPath();
        this.ctx.moveTo(segment.x1, segment.y1);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
    }

    /**
     * PUBLIC API: Starts the initial animation from given points.
     * @param {Array<{x: number, y: number}>} startPoints - Array of starting points.
     * @param {number} length - The initial length for the vertical lines.
     * @returns {Array<string>} An array of the new segment IDs.
     */
    startInitialDraw(startPoints, length = 300) {
        const newSegmentIds = [];
        startPoints.forEach(p => {
            const id = this.addSegment(p.x, p.y, p.x, p.y + length);
            newSegmentIds.push(id);
        });
        return newSegmentIds;
    }

    /**
     * PUBLIC API: Creates a horizontal branch from a vertical line.
     * @param {number} y - The Y coordinate for the branch.
     * @param {number} x_left - The leftmost X coordinate.
     * @param {number} x_right - The rightmost X coordinate.
     * @param {number} from_x - The X coordinate of the vertical line to branch from.
     * @returns {Array<string>} An array of the new segment IDs.
     */
    drawBranch(y, x_left, x_right, from_x) {
        const ids = [
            this.addSegment(from_x, y, x_left, y), // Left horizontal
            this.addSegment(from_x, y, x_right, y) // Right horizontal
        ];
        return ids;
    }
    
    /**
     * PUBLIC API: Checks if an area, defined by its bounding segments, is fully drawn.
     * @param {Array<string>} segmentIds - The IDs of segments that bound a component.
     * @returns {boolean} - True if all segments are in the FINISHED state.
     */
    isAreaReady(segmentIds) {
        if (!segmentIds || segmentIds.length === 0) return false;
        
        return segmentIds.every(id => {
            const segment = this.segments.get(id);
            return segment && segment.state === SEGMENT_STATE.FINISHED;
        });
    }

    /**
     * PUBLIC API: Triggers the erasing animation for given segments.
     * @param {Array<string>} segmentIds - The IDs of segments to erase.
     */
    eraseSegments(segmentIds) {
        segmentIds.forEach(id => {
            const segment = this.segments.get(id);
            if (segment) {
                segment.state = SEGMENT_STATE.ERASING;
            }
        });
    }

    /**
     * Builds grid segments based on the geometry of rendered components.
     * @param {HTMLElement[]} elements - Array of DOM elements to build grid around.
     */
    buildFromComponents(elements) {
        // Clear existing segments
        this.segments.clear();
        
        // Create grid segments around each element
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Add horizontal lines above and below the element
            this.addSegment(0, rect.top - 20, this.canvas.width, rect.top - 20);
            this.addSegment(0, rect.bottom + 20, this.canvas.width, rect.bottom + 20);
            
            // Add vertical lines to the left and right of the element
            this.addSegment(rect.left - 20, 0, rect.left - 20, this.canvas.height);
            this.addSegment(rect.right + 20, 0, rect.right + 20, this.canvas.height);
        });
        
        // Start drawing the segments
        this.startInitialDraw();
    }

    // --- Internal and Helper Methods ---

    /**
     * Adds a new segment to the state, ensuring no duplicates.
     * @private
     */
    addSegment(x1, y1, x2, y2) {
        const id = `s_${x1}_${y1}_${x2}_${y2}`;
        if (this.segments.has(id)) return id;

        this.segments.set(id, {
            id, x1, y1, x2, y2,
            length: Math.hypot(x2 - x1, y2 - y1),
            currentLength: 0,
            state: SEGMENT_STATE.DRAWING,
        });
        return id;
    }
    
    startAnimationLoop() {
        if (this.isAnimationLoopRunning) return;
        this.isAnimationLoopRunning = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame((ts) => this.animationLoop(ts));
    }
    
    onResize() {
        this.canvas.width = document.documentElement.scrollWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }
    
    /**
     * Clears all segments and stops animation. Used for full rebuilds.
     */
    destroy() {
        this.isAnimationLoopRunning = false;
        this.segments.clear();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}