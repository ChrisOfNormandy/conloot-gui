/**
 *
 * @param {string} str
 * @param {string} tag
 * @returns {number}
 */
export function getIndex(str, tag) {
    return str.indexOf(tag) + tag.length;
}

const tabSize = 4;
const libVersion = '1.6';

const tagList = {
    'org_name': /%org_name%/g,
    'mod_name': /%mod_name%/g,
    'mod_name_lc': /%mod_name_lc%/g
};

const autoTagList = {
    'tab': {
        r: /%tab_(\d+)%/,
        f: (n) => { return ' '.repeat(n * tabSize); }
    },
    'libRepo': {
        r: /%lib_repo_url%/,
        f: (v) => {
            let version = v || '1.18.2';

            return `https://raw.githubusercontent.com/ChrisOfNormandy/CoNLib/${version}`;
        }
    },
    'libVersion': {
        r: /%lib_version%/,
        f: (v) => {
            return v
                ? v
                : libVersion;
        }
    }
};

/**
 *
 * @param {string} str
 * @param {{org_name: string, mod_name: string}}
 * @returns {string}
 */
export function replTags(str, options = {}) {
    let s = str;

    if (options.org_name !== undefined)
        s = s.replace(tagList.org_name, options.org_name);

    if (options.mod_name !== undefined) {
        s = s
            .replace(tagList.mod_name, options.mod_name)
            .replace(tagList.mod_name_lc, options.mod_name.toLowerCase());
    }

    let m = null;
    for (let tag in autoTagList) {
        m = s.match(autoTagList[tag].r);
        while (m !== null) {
            s = s.replace(m[0], autoTagList[tag].f(m[1]));
            m = s.match(autoTagList[tag].r);
        }
    }

    return s;
}