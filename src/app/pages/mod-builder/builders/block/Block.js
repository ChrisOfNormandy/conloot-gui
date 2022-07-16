import { v4 } from 'uuid';
import { BlockProperties_v18_2 } from './BlockProperties';

import * as blockstates from './blockstates';

export default class Block {
    getPropertiesString() {
        return `Properties.copy(Blocks.STONE)${this.properties.toString()}`;
    }

    // eslint-disable-next-line class-methods-use-this
    getItemGroupString() {
        return 'CreativeModeTab.TAB_BUILDING_BLOCKS';
    }

    getBlockstate() {
        switch (this.modelType) {
            default: return blockstates.getBlock(null, this.name);
        }
    }

    getStrings() {
        return [
            `%tab_2%// block<${this.uuid}>`,
            `%tab_2%Standard.create("${this.name}", ${this.getPropertiesString()}, ${this.getItemGroupString()});`,
            `%tab_2%// </${this.uuid}>`
        ];
    }

    toString() {
        return this.getStrings().join('\n');
    }

    /**
     *
     * @param {string} modName
     * @param {string} name
     */
    constructor(modName, name) {
        this.uuid = v4();

        this.modName = modName;
        this.name = name;

        this.properties = new BlockProperties_v18_2();

        this.modelType = 'full-block';
    }
}