/**
 * @fileoverview A service for loading content from a JSON file.
 */

import { logging } from '../../utils/logging.js';

/**
 * Asynchronously fetches and parses content from a specified JSON file.
 * Handles potential network or parsing errors.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the parsed content object, or null if an error occurs.
 */
export async function loadContent() {
    // Path to the content file.
    const contentPath = '/content/content.json';

    try {
        // Fetching the content file.
        const response = await fetch(contentPath);

        // Check if the request was successful.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parsing the JSON response.
        const contentData = await response.json();
        return contentData;

    } catch (error) {
        // Logging any error that occurred during the process.
        logging.error('Failed to load or parse content:', error);
        return null;
    }
}