/**
 *
 * @param {FSManager} archive
 * @param {string} modName
 * @param {string} orgName
 * @returns {Promise<FSManager>}
 */
export function modBlocks(archive, modName, orgName) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    const modDir = src_main_java_com.getDir(orgName).getDir(modName.toLowerCase());

    return new Promise((resolve) => {
        let content = '';

        modDir.addFile('ModBlocks.java', new File([content], 'ModBlocks.java', { type: src_main_java_com.getDir(orgName).getDir(modName.toLowerCase()).getFile(modName + '.java').file.type }));

        resolve(archive);
    });
}