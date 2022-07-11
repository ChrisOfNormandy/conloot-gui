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
 * @param {FSManager} archive
 * @returns {Promise<FSManager>}
 */
export function modsToml(archive, orgName, modName) {
    const modsTomlFile = archive.fetch('src/main/resources/META-INF/mods.toml');
    if (modsTomlFile === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    return new Promise((resolve, reject) => {
        modsTomlFile.file.text()
            .then((fileData) => {
                let content = fileData;

                for (let r in replacements) {
                    content = content.replace(new RegExp(r, 'g'), replacements[r](orgName, modName));
                }

                modsTomlFile.write(content);

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}