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
export function packMcMeta(archive, orgName, modName) {
    const packFile = archive.fetch('src/main/resources/pack.mcmeta');

    if (packFile === null)
        return Promise.reject(new Error('Failed to fetch pack.mcmeta file.'));

    return new Promise((resolve, reject) => {
        packFile.file.text()
            .then((fileData) => {
                let content = fileData;

                for (let r in replacements) {
                    content = content.replace(new RegExp(r, 'g'), replacements[r](orgName, modName));
                }

                packFile.write(content);

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}