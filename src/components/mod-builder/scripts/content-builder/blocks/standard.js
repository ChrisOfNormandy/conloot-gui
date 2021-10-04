import FSManager, { FSDir, FSFile } from "../../../../../app/common/FileSystem";

import * as tags from '../../tags';
import * as stringUtil from '../../../../../helpers/stringUtil';

/**
 * 
 * @param {FSFile} modBlocks 
 * @param {string} name 
 * @returns {Promise<FSFile>}
 */
export function create(modBlocks, name) {
    return new Promise((resolve, reject) => {
        modBlocks.file.text()
            .then(fileData => {
                let content = fileData;

                content = stringUtil.splice(content, `Standard.create("${name}", Properties.copy(Blocks.STONE), ItemGroup.TAB_BUILDING_BLOCKS);\n%tab_2%`, content.indexOf("// ##MB_TAG##"));

                content = tags.replTags(content);

                modBlocks.file = new File([content], modBlocks.file.name, { type: modBlocks.file.type });

                resolve(modBlocks);
            })
            .catch(err => reject(err));
    });
}