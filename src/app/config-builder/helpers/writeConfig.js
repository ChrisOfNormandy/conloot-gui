function getObj() {
    return {
        Blocks: {
            Suite: {
                "String Lists": {
                    wood_suite_list: [],
                    stone_suite_list: []
                }
            },
            Redstone: {
                "String Lists": {
                    fence_gate_list: [],
                    door_list: [],
                    trapdoor_list: []
                }
            },
            Generic: {
                "String Lists": {
                    slab_list: [],
                    wall_list: [],
                    block_list: [],
                    stairs_list: [],
                    fence_list: []
                }
            },
            Interactive: {
                "String Lists": {
                    barrel_list: [],
                    shulker_list: []
                }
            }
        },
        UI: {
            ItemGroups: {
                "String Lists": {
                    tabs: []
                }
            }
        },
        Items: {
            Tool: {
                "String Lists": {
                    pickaxe_list: [],
                    axe_list: [],
                    hoe_list: [],
                    shovel_list: []
                }
            }
        },
        Resources: {
            Ores: {
                "String Lists": {
                    gem_list: [],
                    metal_list: []
                }
            },
            Plants: {
                "String Lists": {
                    crop_list: []
                }
            }
        },
        WorldGen: {
            Biomes: {
                "String Lists": {
                    biome_list: []
                }
            }
        }
    }
}

function getFormattedValue(key, value) {
    return `${key} = [${value.join(', ')}]\n`;
}

function getFormattedGroup(prefix, key, value) {
    if (value.length >= 0)
        return getFormattedValue(key, value);
    else {
        let _key = `${prefix === null ? '' : `${prefix}.`}${key !== null ? key.includes(" ") ? `"${key}"` : key : ""}`;

        let str = key === null ? '' : `[${_key}]\n`;

        for (let i in value)
            str += getFormattedGroup(key !== null ? _key : null, i, value[i]);

        return str;
    }
}

function getBlocks(blockList) {
    return getFormattedGroup(null, null, blockList);
}

function write(blockList) {
    const blob = new Blob([getBlocks(blockList)], {type: 'application/toml'});
    const url = window.URL.createObjectURL(blob);
    let link = document.getElementById('download_link');
    link.href = url;
    link.setAttribute('download', 'conloot.toml');
    link.click();
}

export {
    write,
    getObj
}