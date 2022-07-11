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

                // const tagOptions = { mod_name: modName, org_name: orgName };

                // content = tags.replTags(content, tagOptions);

                content = content
                    .replace(/examplemod/g, modName.toLowerCase());
                content = content
                    .replace(/ExampleMod/g, modName);
                content = content
                    .replace(/example/, orgName.toLowerCase());

                // let constructBody = content.match(new RegExp(`public ${modName}\\(\\) {\n([^}]+)}`));

                // if (constructBody)
                //     content = content.replace(constructBody[1], `${' '.repeat(tabSize * 2)}// ##CON_TAG##\n${' '.repeat(tabSize)}`);

                // content = stringUtil.del(content, content.indexOf('private void setup'), content.indexOf('@Mod.EventBusSubscriber(bus=Mod.EventBusSubscriber.Bus.MOD)'));

                // Replace imports
                // content = tags.replTags(content, tagOptions);
                // content = stringUtil.del(content, content.indexOf('import net.minecraft.block.Block;'), content.indexOf(`@Mod("${modName.toLowerCase()}")`));

                // Add ModBlocks Init method to block registry event function

                // Create and set file
                modMain.write(content);

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}