// eslint-disable-next-line no-unused-vars
import FSManager from '../../../common/file-system/FSManager';

import { modify__buildGradle } from './files/base/build-gradle';

import * as stringUtil from '../../../common/string-util';

const tabSize = 4;

/**
 *
 * @param {FSManager} archive
 * @returns {Promise<{archive: FSManager, modName: string, orgName: string}>}
 */
export function examplemod(archive, preset = false) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    if (src_main_java_com === null)
        return Promise.reject(new Error('Failed to fetch file: \'src/main/java/com\''));

    let orgName, modName;
    if (!preset) {
        orgName = prompt('Organization (or your name)', 'myorg').toLowerCase() || 'myorg';
        modName = prompt('Mod name', 'MyMod').replace(/[^a-zA-Z0-9]/g, '') || 'MyMod';
    }
    else {
        orgName = 'myorg';
        modName = 'MyMod';
    }

    return new Promise((resolve, reject) => {
        let modMain = src_main_java_com
            .getDir('example').rename(orgName)
            .getDir('examplemod').rename(modName.toLowerCase())
            .getFile('ExampleMod.java').rename(modName + '.java');

        modMain.file.text()
            .then((fileData) => {
                let content = fileData;

                // const tagOptions = { mod_name: modName, org_name: orgName };

                // content = tags.replTags(content, tagOptions);

                let constructBody = content.match(new RegExp(`public ${modName}\\(\\) {\n([^}]+)}`));

                if (constructBody)
                    content = content.replace(constructBody[1], `${' '.repeat(tabSize * 2)}// ##CON_TAG##\n${' '.repeat(tabSize)}`);

                content = stringUtil.del(content, content.indexOf('private void setup'), content.indexOf('@Mod.EventBusSubscriber(bus=Mod.EventBusSubscriber.Bus.MOD)'));

                // Replace imports
                // content = tags.replTags(content, tagOptions);
                content = stringUtil.del(content, content.indexOf('import net.minecraft.block.Block;'), content.indexOf(`@Mod("${modName.toLowerCase()}")`));

                // Add ModBlocks Init method to block registry event function

                // Create and set file
                modMain.file = new File([content], modMain.file.name, { type: modMain.file.type });

                modify__buildGradle(archive, modName, orgName)
                    .then((archive) => {
                        resolve({
                            archive,
                            modName,
                            orgName
                        });
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}