/**
 *
 * @param {string} str
 * @returns
 */
function replTabs(str) {
    const m = str.match(/%tab_(\d+)%/);
    if (m)
        return replTabs(str.replace(m[0], ' '.repeat(4 * m[1])));

    return str;
}

/**
 *
 * @param {string} str
 * @returns
 */
export function tagRepl(str) {
    return replTabs(str);
}