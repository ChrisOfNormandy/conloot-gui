import editor from '../../editor';

/**
 *
 * @param {FSManager} archive
 * @returns {Promise<{archive: FSManager, modName: string, orgName: string}>}
 */
export function examplemod_java(archive, orgName, modName) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    if (src_main_java_com === null)
        return Promise.reject(new Error('Failed to fetch file: \'src/main/java/com\''));

    return new Promise((resolve, reject) => {
        try {
            src_main_java_com = src_main_java_com
                .getDir('example').rename(orgName);
        }
        catch (err) {
            console.error(err);
            console.error('Folder "example" does not exist.');
        }

        try {
            src_main_java_com = src_main_java_com
                .getDir('examplemod').rename(modName.toLowerCase());
        }
        catch (err) {
            console.error(err);
            console.error('Folder "examplemod" does not exist.');
        }

        const modMain = src_main_java_com
            .getFile('ExampleMod.java').rename(modName + '.java');

        modMain.file.text()
            .then((fileData) => {
                let content = fileData;

                content = content
                    .replace(/examplemod/g, modName.toLowerCase());
                content = content
                    .replace(/ExampleMod/g, modName);
                content = content
                    .replace(/example/, orgName.toLowerCase());

                content = content
                    .replace('// Register a new block here', 'ModBlocks.Init();\n')
                    .replace('HELLO from Register Block', 'Finished registering modded blocks. :)');

                modMain.write(editor.tagRepl(content));

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}