// eslint-disable-next-line no-unused-vars
import FSManager from '../../../common/file-system/FSManager';

import { modify__buildGradle } from './files/base/build-gradle';
import { modsToml } from './files/base/mods-toml';
import { examplemod_java } from './replacers/examplemod';

// import * as stringUtil from '../../../common/string-util';

// const tabSize = 4;

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

    const files = [
        examplemod_java,
        modify__buildGradle,
        modsToml
    ];

    const iterateFiles = (archive, i = 0) => {
        if (i === files.length)
            return Promise.resolve(archive);

        return new Promise((resolve, reject) => {
            files[i](archive, orgName, modName)
                .then((a) => iterateFiles(a, i + 1))
                .then(resolve)
                .catch(reject);
        });
    };

    return new Promise((resolve, reject) => {
        iterateFiles(archive)
            .then((a) => {
                resolve({
                    archive: a,
                    modName,
                    orgName
                });
            })
            .catch(reject);
    });
}