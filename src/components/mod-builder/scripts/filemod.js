import FSManager from "../../../app/common/FileSystem";

import * as stringUtil from '../../../helpers/stringUtil';
import * as tags from './tags';

import replList from './repl-list.json';

const tabSize = 4;

/**
 * 
 * @param {FSManager} archive 
 * @returns {Promise<{archive: FSManager, modName: string, orgName: string}>}
 */
export function examplemod(archive, preset = false) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    if (src_main_java_com === null)
        return Promise.reject(new Error(`Failed to fetch file: 'src/main/java/com'`));

    let orgName, modName;
    if (!preset) {
        orgName = prompt('Organization (or your name)', 'myorg').toLowerCase() || 'myorg';
        modName = prompt('Mod name', 'MyMod').replace(/[^a-zA-Z0-9]/g, '') || 'MyMod';
    }
    else {
        orgName = "myorg";
        modName = "MyMod";
    }

    return new Promise((resolve, reject) => {
        let modMain = src_main_java_com
            .getDir('example').rename(orgName)
            .getDir('examplemod').rename(modName.toLowerCase())
            .getFile('ExampleMod.java').rename(modName + '.java');

        modMain.file.text()
            .then(fileData => {
                let content = fileData;
                const repl = replList.tags;

                for (let r in repl)
                    content = content.replace(repl[r].from, repl[r].to);

                let ind = 0;
                const tagOptions = { mod_name: modName, org_name: orgName };

                content = tags.replTags(content, tagOptions);

                let constructBody = content.match(new RegExp(`public ${modName}\\(\\) {\n([^}]+)}`));

                content = content.replace(constructBody[1], `${' '.repeat(tabSize * 2)}// ##CON_TAG##\n${' '.repeat(tabSize)}`);
                
                // Replace pre-contructor body
                ind = tags.getIndex(content, 'LogManager.getLogger();');
                content = stringUtil.splice(content, '\n' + replList["Main.java"].preConstructorBody.join('\n'), ind);

                // Replace constructor body
                ind = tags.getIndex(content, '##CON_TAG##');
                content = stringUtil.splice(content, '\n' + replList["Main.java"].constructorBody.join('\n'), ind);

                content = stringUtil.del(content, content.indexOf("private void setup"), content.indexOf("@Mod.EventBusSubscriber(bus=Mod.EventBusSubscriber.Bus.MOD)"));

                // Replace imports
                content = tags.replTags(content, tagOptions);
                content = stringUtil.del(content, content.indexOf('import net.minecraft.block.Block;'), content.indexOf(`@Mod("${modName.toLowerCase()}")`));
                content = stringUtil.splice(content, replList["Main.java"].imports.join('\n') + '\n', content.indexOf(`@Mod("${modName.toLowerCase()}")`));

                // Add ModBlocks Init method to block registry event function
                content = stringUtil.splice(content, tags.replTags(replList["Main.java"].blockRegistry.code), tags.getIndex(content, replList["Main.java"].blockRegistry.front));

                // Create and set file
                modMain.file = new File([content], modMain.file.name, { type: modMain.file.type });

                modify__buildGradle(archive, modName, orgName)
                    .then(archive => {
                        resolve({
                            archive,
                            modName,
                            orgName
                        });
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {FSManager} archive 
 * @param {string} modName 
 * @param {string} orgName 
 * @returns {Promise<FSManager>}
 */
function modify__buildGradle(archive, modName, orgName) {
    const buildGradle = archive.root.getFile('build.gradle');
    if (buildGradle === null)
        return Promise.reject(new Error('Failed to fetch build.gradle file.'));

    return new Promise((resolve, reject) => {
        buildGradle.file.text()
            .then(fileData => {
                let content = fileData;

                content = stringUtil.splice(content, replList["build.gradle"].repositories.data.join('\n'), tags.getIndex(content, replList["build.gradle"].repositories.tag));
                content = stringUtil.splice(content, replList["build.gradle"].dependencies.data, tags.getIndex(content, replList["build.gradle"].dependencies.tag));

                content = content.replace(replList["build.gradle"].group.from, replList["build.gradle"].group.to);
                content = content.replace(replList["build.gradle"].archivesBaseName.from, replList["build.gradle"].archivesBaseName.to);
                content = content.replace(replList["build.gradle"]["Specification-Title"].from, replList["build.gradle"]["Specification-Title"].to);
                content = content.replace(replList["build.gradle"]["Specification-Vendor"].from, replList["build.gradle"]["Specification-Vendor"].to);
                content = content.replace(replList["build.gradle"]["Implementation-Vendor"].from, replList["build.gradle"]["Implementation-Vendor"].to);
                content = content.replace(replList["build.gradle"].reobf.from, replList["build.gradle"].reobf.to);

                content = tags.replTags(content, { mod_name: modName, org_name: orgName });

                buildGradle.file = new File([content], buildGradle.file.name, { type: buildGradle.file.type });

                packMcMeta(archive, modName, orgName)
                    .then(archive => resolve(archive))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {FSManager} archive 
 * @param {string} modName 
 * @param {string} orgName 
 * @returns {Promise<FSManager>}
 */
function packMcMeta(archive, modName, orgName) {
    const packFile = archive.fetch('src/main/resources/pack.mcmeta');
    if (packFile === null)
        return Promise.reject(new Error('Failed to fetch pack.mcmeta file.'));

    return new Promise((resolve, reject) => {
        packFile.file.text()
            .then(fileData => {
                let content = fileData;

                for (let i in replList.packMcMeta)
                    content = content.replace(replList.packMcMeta[i].from, replList.packMcMeta[i].to);

                content = tags.replTags(content, { mod_name: modName, org_name: orgName });

                packFile.file = new File([content], packFile.file.name, { type: packFile.file.type });

                modsToml(archive, modName, orgName)
                    .then(archive => resolve(archive))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {FSManager} archive 
 * @param {string} modName 
 * @param {string} orgName 
 * @returns {Promise<FSManager>}
 */
function modsToml(archive, modName, orgName) {
    const modsTomlFile = archive.fetch('src/main/resources/META-INF/mods.toml');
    if (modsTomlFile === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    return new Promise((resolve, reject) => {
        modsTomlFile.file.text()
            .then(fileData => {
                let content = fileData;

                for (let i in replList.modsToml)
                    content = content.replace(replList.modsToml[i].from, replList.modsToml[i].to);

                content += replList.modsTomlDependency.join('\n');

                content = tags.replTags(content, { mod_name: modName, org_name: orgName });


                modsTomlFile.file = new File([content], modsTomlFile.file.name, { type: modsTomlFile.file.type });

                modBlocks(archive, modName, orgName)
                    .then(archive => resolve(archive))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {FSManager} archive 
 * @param {string} modName 
 * @param {string} orgName 
 * @returns {Promise<FSManager>}
 */
function modBlocks(archive, modName, orgName) {
    let src_main_java_com = archive.fetchDir('src/main/java/com');

    const modDir = src_main_java_com.getDir(orgName).getDir(modName.toLowerCase());

    return new Promise((resolve, reject) => {
        let content = replList["ModBlocks.java"].data.join('\n');

        content = tags.replTags(content, { mod_name: modName, org_name: orgName });

        modDir.addFile('ModBlocks.java', new File([content], "ModBlocks.java", { type: src_main_java_com.getDir(orgName).getDir(modName.toLowerCase()).getFile(modName + ".java").file.type }));

        resolve(archive);
    });
}