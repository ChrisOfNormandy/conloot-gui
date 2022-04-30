/**
 *
 * @param {FSManager} archive
 * @returns {Promise<FSManager>}
 */
export function modify__buildGradle(archive) {
    const buildGradle = archive.root.getFile('build.gradle');
    if (buildGradle === null)
        return Promise.reject(new Error('Failed to fetch build.gradle file.'));

    return new Promise((resolve, reject) => {
        buildGradle.file.text()
            .then((fileData) => {
                let content = fileData;

                buildGradle.file = new File([content], buildGradle.file.name, { type: buildGradle.file.type });

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}