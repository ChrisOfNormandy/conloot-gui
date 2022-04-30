/**
 *
 * @param {FSManager} archive
 * @returns {Promise<FSManager>}
 */
export function packMcMeta(archive) {
    const packFile = archive.fetch('src/main/resources/pack.mcmeta');
    if (packFile === null)
        return Promise.reject(new Error('Failed to fetch pack.mcmeta file.'));

    return new Promise((resolve, reject) => {
        packFile.file.text()
            .then((fileData) => {
                let content = fileData;

                packFile.file = new File([content], packFile.file.name, { type: packFile.file.type });

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}