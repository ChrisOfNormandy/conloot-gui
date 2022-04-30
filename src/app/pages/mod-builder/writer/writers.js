import * as stringUtil from '../../../common/string-util';

/**
 *
 * @param {FSFile} fs_file
 * @param {string} name
 * @param {string[]} strings
 * @returns {Promise<FSFile>}
 */
export function write(fs_file, strings) {
    return new Promise((resolve, reject) => {
        fs_file.file.text()
            .then((fileData) => {
                let content = fileData;

                content = stringUtil.splice(content, '\n' + strings.join('\n') + '\n', content.indexOf('// ##MB_TAG##'));

                // content = tags.replTags(content);

                fs_file.file = new File([content], fs_file.file.name, { type: fs_file.file.type });

                resolve(fs_file);
            })
            .catch((err) => reject(err));
    });
}