/**
 * @fileoverview Represents the Header component of the page.
 */

export class Header {
    /**
     * Creates an instance of the Header.
     * @param {object} headerData - Data for the main header section.
     * @param {string} headerData.name - The main name to display.
     * @param {string} headerData.subheader - The subheader text (e.g., job title).
     * @param {object} contactsData - Data for the contacts section.
     * @param {string} contactsData.telegram - Text for the Telegram contact.
     * @param {string} contactsData.email - Text for the email contact.
     */
    constructor(headerData, contactsData) {
        this.headerData = headerData;
        this.contactsData = contactsData;
        this.element = null;
    }

    /**
     * Renders the header component into an HTMLElement.
     * @returns {HTMLElement} The rendered header element.
     */
    render() {
        const header = document.createElement('header');
        header.className = 'header';
        header.style.backgroundColor = '#1E1E1E'; // COLOR_BACKGROUND_DARK

        const mainInfo = document.createElement('div');
        mainInfo.className = 'header__main-info';
        
        const nameEl = document.createElement('h1');
        nameEl.textContent = this.headerData.name;
        
        const subheaderEl = document.createElement('p');
        subheaderEl.className = 'subheader';
        subheaderEl.textContent = this.headerData.subheader;

        mainInfo.append(nameEl, subheaderEl);

        const contactsInfo = document.createElement('div');
        contactsInfo.className = 'header__contacts';
        
        const telegramEl = document.createElement('p');
        telegramEl.textContent = this.contactsData.telegram;
        
        const emailEl = document.createElement('p');
        emailEl.textContent = this.contactsData.email;

        contactsInfo.append(telegramEl, emailEl);
        
        header.append(mainInfo, contactsInfo);

        this.element = header;
        return this.element;
    }
}