import modsTomlReplacers from '../../replacers/mods-toml';
import modsTomlAppenders from '../appenders/mods-toml';

/**
 *
 * @param {FSManager} archive
 * @returns {Promise<FSManager>}
 */
export function modsToml(archive) {
    const modsTomlFile = archive.fetch('src/main/resources/META-INF/mods.toml');
    if (modsTomlFile === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    return new Promise((resolve, reject) => {
        modsTomlFile.file.text()
            .then((fileData) => {
                let content = fileData;

                modsTomlReplacers.forEach((repl) => {
                    content = content.replace(repl.from, repl.to);
                });

                content += modsTomlAppenders.join('\n');

                // content = tags.replTags(content, { mod_name: modName, org_name: orgName });

                modsTomlFile.file = new File([content], modsTomlFile.file.name, { type: modsTomlFile.file.type });

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}