/**
 * @fileoverview A simple logging utility for consistent console output.
 */

export const logging = {
    /**
     * Logs an error message to the console.
     * @param {...any} args - Arguments to log.
     */
    error: (...args) => {
        console.error('[App Error]', ...args);
    },
    /**
     * Logs an informational message to the console.
     * @param {...any} args - Arguments to log.
     */
    info: (...args) => {
        console.log('[App Info]', ...args);
    }
};