/**
 *
 * @param {import('../../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../../common/file-system/FSManager').default>}
 */
export function langEnUS(archive, orgName, modName, data = null) {
    const resources = archive.fetchDir('src/main/resources');

    if (resources === null)
        return Promise.reject(new Error('Failed to fetch mods.toml file.'));

    let lang = resources
        .getOrAddDir('assets')
        .getOrAddDir(modName.toLowerCase())
        .getOrAddDir('lang')
        .addFile('en_us.json', new File([''], 'en_us.json'), true);

    console.debug('Writing to lang:', data);

    return new Promise((resolve) => {
        lang.write(data || '{}');

        resolve(archive);
    });
}

// "block.minecraft.pink_candle_cake": "Cake with Pink Candle",
