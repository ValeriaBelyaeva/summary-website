/**
 * @fileoverview Represents the Skills information block component.
 */

export class SkillsBlock {
    /**
     * Creates an instance of the SkillsBlock.
     * @param {object} data - The data for the skills block.
     * @param {string} data.textHeader - The header text for the block.
     * @param {string} data.textBody - The body text for the block.
     */
    constructor(data) {
        // Data object containing all text content for this component.
        this.data = data;
        // The root element for this component.
        this.element = null;
    }

    /**
     * Renders the component into an HTMLElement using the provided data.
     * @returns {HTMLElement} The rendered section element for the skills block.
     */
    render() {
        const section = document.createElement('section');
        section.className = 'skills-block';
        section.style.backgroundColor = '#F58A07'; // COLOR_BACKGROUND_ACCENT

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        const header = document.createElement('h2');
        header.textContent = this.data.textHeader;
        // Styling according to TEXT_STYLE_BLOCK_HEADER would be applied via CSS classes.

        const body = document.createElement('p');
        body.textContent = this.data.textBody;
        // Styling according to TEXT_STYLE_BODY would be applied via CSS classes.

        textContainer.append(header, body);
        section.append(textContainer);

        this.element = section;
        return this.element;
    }
}