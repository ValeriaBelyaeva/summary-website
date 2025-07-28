/**
 * @fileoverview Main entry point for the application.
 */

import { loadContent } from '/src/scripts/services/contentLoader.js';
import { Header } from '/src/components/Header.js';
import { SkillsBlock } from '/src/components/SkillsBlock.js';
import { ExperienceBlock } from '/src/components/ExperienceBlock.js';
import { Grid } from '/src/scripts/Grid.js';
import { throttle, debounce } from '/src/utils/events.js';

class App {
    constructor(rootSelector) {
        this.rootElement = document.querySelector(rootSelector);
        this.grid = new Grid();
        this.renderedElements = []; // Store rendered DOM elements
    }

    async init() {
        if (!this.rootElement) {
            console.error('Root element not found.');
            return;
        }

        // 1. Initialize the grid system first
        this.grid.init(this.rootElement);

        // 2. Load content
        const contentData = await loadContent();
        if (!contentData) return;

        // 3. Render all components (but keep them invisible for now)
        this._renderComponents(contentData);

        // 4. Build the static grid from the components' geometry
        // We use a short timeout to ensure the browser has calculated layout
        setTimeout(() => {
            this.grid.buildFromComponents(this.renderedElements);
            
            // 5. Reveal the components now that the grid is "ready"
            this._revealComponents();

            // 6. Setup event listeners for resize
            this._setupEventListeners();
        }, 100); // A small delay is a robust way to wait for layout
    }

    _renderComponents(data) {
        // We use a document fragment for efficient DOM insertion
        const fragment = document.createDocumentFragment();

        const header = new Header(data.header, data.contacts);
        const headerEl = header.render();
        
        const skillsRow = this._createSkillsRow(data);
        
        const experience = new ExperienceBlock(data.experience);
        const experienceEl = experience.render();

        fragment.append(headerEl, skillsRow, experienceEl);
        this.rootElement.appendChild(fragment);

        // Store rendered elements for the grid to use
        this.renderedElements = [headerEl, skillsRow, experienceEl];
        
        // Hide all components initially to wait for the grid
        this.renderedElements.forEach(el => el.style.opacity = '0');
    }
    
    _createSkillsRow(data) {
        const skillsRow = document.createElement('div');
        skillsRow.className = 'grid-row';
        
        const skillsComponent = new SkillsBlock(data.skills);
        const emptyBlock = document.createElement('div');
        emptyBlock.className = 'empty-block';
        
        skillsRow.append(skillsComponent.render(), emptyBlock);
        return skillsRow;
    }
    
    _revealComponents() {
        this.renderedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            
            // This is the check for animation readiness.
            // In this static version, it will always be true.
            if (this.grid.isAreaReady(rect)) {
                el.style.transition = 'opacity 0.5s';
                el.style.opacity = '1';
            }
        });
    }

    _setupEventListeners() {
        // On resize, we need to rebuild the components and the grid
        // to get correct new coordinates.
        window.addEventListener('resize', debounce(() => this.rebuild(), 250));
    }
    
    rebuild() {
        // A simple full rebuild on resize for this static version
        this.rootElement.innerHTML = '';
        this.init();
    }
}

// Instantiate and start the application
const app = new App('#app-container');
app.init();