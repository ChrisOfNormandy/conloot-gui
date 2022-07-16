import editor from '../../../editor';

const fullBlock = {
    'parent': 'minecraft:block/cube_all',
    'textures': {
        'all': '%namespace%:block/%texture_name%'
    }
};

const blockItem = {
    'parent': '%namespace%:block/%block_name%'
};

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function blockModel(archive, blockName, modName = null, textureName = 'stone') {
    const resources = archive.fetchDir('src/main/resources');

    if (resources === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    const namespace = modName || editor.modName.toLowerCase();

    let bs = resources
        .getOrAddDir('assets')
        .getOrAddDir(editor.modName.toLowerCase())
        .getOrAddDir('models')
        .getOrAddDir('block')
        .addFile(blockName + '.json', new File([''], blockName + '.json'), true);

    console.debug('Writing model:', blockName);

    return new Promise((resolve) => {
        let content = JSON.stringify(fullBlock, null, 4);

        content = content
            .replace(new RegExp('%texture_name%', 'g'), textureName)
            .replace(new RegExp('%namespace%', 'g'), namespace);

        console.debug('Block model:', content);

        bs.write(editor.tagRepl(content));

        resolve(archive);
    });
}

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function blockItemModel(archive, blockName) {
    const resources = archive.fetchDir('src/main/resources');

    if (resources === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    const namespace = editor.modName.toLowerCase();

    let bs = resources
        .getOrAddDir('assets')
        .getOrAddDir(namespace)
        .getOrAddDir('models')
        .getOrAddDir('item')
        .addFile(blockName + '.json', new File([''], blockName + '.json'), true);

    console.debug('Writing item model:', blockName);

    return new Promise((resolve) => {
        let content = JSON.stringify(blockItem, null, 4);

        content = content
            .replace(new RegExp('%block_name%', 'g'), blockName)
            .replace(new RegExp('%namespace%', 'g'), namespace);

        console.debug('Block item model:', content);

        bs.write(editor.tagRepl(content));

        resolve(archive);
    });
}