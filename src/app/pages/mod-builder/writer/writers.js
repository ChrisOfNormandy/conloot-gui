import * as stringUtil from '../../../common/string-util';
import editor from '../editor';

/**
 *
 * @param {import('../../../common/file-system/FSFile').default} fs_file
 * @param {string} name
 * @param {import('../builders/block/Block').default[]} blocks
 * @returns {Promise<FSFile>}
 */
export function write(fs_file, blocks) {
    return new Promise((resolve, reject) => {
        fs_file.file.text()
            .then((fileData) => {
                let content = fileData;

                let strings = [];

                blocks.forEach((block) => {
                    const v = block.getStrings();

                    if (content.match(new RegExp('block<' + block.uuid + '>')) === null)
                        strings.push(block.toString());
                    else
                        content = editor.tagRepl(stringUtil.splice(content, '\n' + v[1] + '\n%tab_2%', content.indexOf(v[2])));
                });

                if (strings.length) {
                    content = editor.tagRepl(stringUtil.splice(content, '\n' + strings.join('\n') + '\n%tab_2%', content.indexOf('// ##MB_TAG##')));

                    fs_file.file = new File([content], fs_file.file.name, { type: fs_file.file.type });
                }
                resolve(fs_file);
            })
            .catch((err) => reject(err));
    });
}