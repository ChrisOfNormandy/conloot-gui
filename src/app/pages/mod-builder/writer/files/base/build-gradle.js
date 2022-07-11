import { splice } from '../../../../../common/string-util';

const _repl = {
    org: (orgName) => orgName.toLowerCase(),
    mod: (_, modName) => modName.toLowerCase()
};

const replacements = {
    'yourname': _repl.org,
    'modid': _repl.mod,
    'examplemodsareus': _repl.org,
    'examplemod': _repl.mod
};

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function modify__buildGradle(archive, orgName, modName) {
    const buildGradle = archive.fetch('build.gradle');

    if (buildGradle === null)
        return Promise.reject(new Error('Failed to fetch build.gradle file.'));

    return new Promise((resolve, reject) => {
        buildGradle.file.text()
            .then((fileData) => {
                let content = fileData;

                for (let r in replacements) {
                    content = content.replace(new RegExp(r, 'g'), replacements[r](orgName, modName));
                }

                content = content.replace(/\s*\/\/\s.*\n?/g, '');

                const dep = 'minecraft \'net.minecraftforge:forge:1.18.2-40.1.0\'';
                const index = content.indexOf(dep) + dep.length;
                content = splice(content, '\n    implementation files(\'libs/conlib-1.8-deobf.jar\')\n', index);

                buildGradle.write(content);
                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}