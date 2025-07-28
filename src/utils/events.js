/**
 * @fileoverview Utility functions for handling browser events.
 */

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `delay` milliseconds.
 *
 * @param {Function} func The function to throttle.
 * @param {number} delay The number of milliseconds to throttle invocations to.
 * @returns {Function} Returns the new throttled function.
 */
export function throttle(func, delay) {
    let isThrottled = false; // Flag to check if the function is currently in a cooldown period.
    let savedArgs; // To store arguments of the last call.
    let savedThis; // To store the context of the last call.

    function wrapper(...args) {
        if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        func.apply(this, args);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, delay);
    }

    return wrapper;
}

/**
 * Creates a debounced function that delays invoking `func` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 * @returns {Function} Returns the new debounced function.
 */
export function debounce(func, delay) {
    let timeoutId; // Holds the timer ID.

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}