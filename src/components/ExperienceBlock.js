/**
 * @fileoverview Represents the Experience information block component.
 */

export class ExperienceBlock {
    /**
     * Creates an instance of the ExperienceBlock.
     * @param {object} data - The data for the experience block.
     * @param {string} data.textHeader - The header text for the block.
     * @param {string} data.textBody - The body text for the block.
     */
    constructor(data) {
        this.data = data;
        this.element = null;
    }

    /**
     * Renders the component into an HTMLElement using the provided data.
     * @returns {HTMLElement} The rendered section element for the experience block.
     */
    render() {
        const section = document.createElement('section');
        section.className = 'experience-block';
        section.style.backgroundColor = '#1E1E1E'; // COLOR_BACKGROUND_DARK

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        const header = document.createElement('h2');
        header.textContent = this.data.textHeader;

        const body = document.createElement('p');
        body.textContent = this.data.textBody;

        textContainer.append(header, body);
        section.append(textContainer);

        this.element = section;
        return this.element;
    }
}