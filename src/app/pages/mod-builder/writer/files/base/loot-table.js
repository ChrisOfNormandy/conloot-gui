import editor from '../../../editor';

const standardBlockLoot = {
    'type': 'minecraft:block',
    'pools': [
        {
            'rolls': 1.0,
            'bonus_rolls': 0.0,
            'entries': [
                {
                    'type': 'minecraft:alternatives',
                    'children': [
                        {
                            'type': 'minecraft:item',
                            'conditions': [
                                {
                                    'condition': 'minecraft:match_tool',
                                    'predicate': {
                                        'enchantments': [
                                            {
                                                'enchantment': 'minecraft:silk_touch',
                                                'levels': {
                                                    'min': 1
                                                }
                                            }
                                        ]
                                    }
                                }
                            ],
                            'name': '%namespace%:%block_name%'
                        },
                        {
                            'type': 'minecraft:item',
                            'conditions': [
                                {
                                    'condition': 'minecraft:survives_explosion'
                                }
                            ],
                            'name': '%namespace2%:%block_name2%'
                        }
                    ]
                }
            ]
        }
    ]
};

/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function blockLootTable(archive, blockName, drop = null) {
    const resources = archive.fetchDir('src/main/resources');

    if (resources === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    const namespace = editor.modName.toLowerCase();

    let lt = resources
        .getOrAddDir('data')
        .getOrAddDir(namespace)
        .getOrAddDir('loot_tables')
        .getOrAddDir('blocks')
        .addFile(blockName + '.json', new File([''], blockName + '.json'), true);

    console.debug('Writing loot table:', blockName);

    let dropNamespace, dropBlockName;
    if (drop === null) {
        dropNamespace = namespace;
        dropBlockName = blockName;
    }
    else {
        dropNamespace = drop.namespace || namespace;
        dropBlockName = drop.blockName || blockName;
    }

    return new Promise((resolve) => {
        let content = JSON.stringify(standardBlockLoot, null, 4);

        content = content
            .replace(new RegExp('%namespace%', 'g'), namespace)
            .replace(new RegExp('%block_name%', 'g'), blockName)
            .replace(new RegExp('%namespace2%', 'g'), dropNamespace)
            .replace(new RegExp('%block_name2%', 'g'), dropBlockName);

        console.debug('Loot table:', content);

        lt.write(editor.tagRepl(content));

        resolve(archive);
    });
}

// "block.minecraft.pink_candle_cake": "Cake with Pink Candle",
