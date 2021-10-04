/**
 * 
 * @param {string} original 
 * @param {string} str 
 * @param {number} index 
 */
export function splice(original, str, index) {
    return original.slice(0, index) + str + original.slice(index, original.length);
}

/**
 * 
 * @param {string} str 
 * @param {number} start 
 * @param {number} stop 
 * @returns {string}
 */
export function del(str, start, stop) {
    if (stop < start)
        return str;

    return str.slice(0, start) + str.slice(stop, str.length);
}