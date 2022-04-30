import BlockProperties from './BlockProperties';

import * as blockstates from './blockstates';

export default class Block {
    getPropertiesString() {
        return `Standard.create("${this.name}", Properties.copy(Blocks.STONE)${this.properties.toString()}, ItemGroup.TAB_BUILDING_BLOCKS);`;
    }

    getBlockstate() {
        switch (this.modelType) {
            default: return blockstates.getBlock(null, this.name);
        }
    }

    constructor(modName, name) {
        this.modName = modName;
        this.name = name;

        this.properties = new BlockProperties();

        this.modelType = 'full-block';
    }
}