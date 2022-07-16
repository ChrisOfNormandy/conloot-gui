import editor from '../../../editor';

const fullBlock = {
    'variants': {
        '': [
            {
                'model': '%namespace%:block/%texture_name%'
            },
            {
                'model': '%namespace%:block/%texture_name%_mirrored'
            },
            {
                'model': '%namespace%:block/%texture_name%',
                'y': 180
            },
            {
                'model': '%namespace%:block/%texture_name%_mirrored',
                'y': 180
            }
        ]
    }
};

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function blockstate(archive, blockName, modName = null, textureName = 'stone') {
    const resources = archive.fetchDir('src/main/resources');

    if (resources === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    const namespace = modName || editor.modName.toLowerCase();

    let bs = resources
        .getOrAddDir('assets')
        .getOrAddDir(editor.modName.toLowerCase())
        .getOrAddDir('blockstates')
        .addFile(blockName + '.json', new File([''], blockName + '.json'), true);

    console.debug('Writing blockstate:', blockName);

    return new Promise((resolve) => {
        let content = JSON.stringify(fullBlock, null, 4);

        content = content
            .replace(new RegExp('%texture_name%', 'g'), textureName)
            .replace(new RegExp('%namespace%', 'g'), namespace);

        console.debug('Blockstate:', content);

        bs.write(editor.tagRepl(content));

        resolve(archive);
    });
}