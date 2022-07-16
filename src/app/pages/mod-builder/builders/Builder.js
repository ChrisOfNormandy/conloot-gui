import Block from './block/Block';

export default class Builder {

    /**
     *
     * @param {string} name
     * @returns
     */
    addBlock(name) {
        let block = new Block(this.modName, name);
        this.blocks.set(name, block);

        return block;
    }

    getAllBlocks() {
        return this.blocks;
    }

    getBlockArray() {
        return Array.from(this.blocks.values());
    }

    getBlockPath() {
        return `src/main/java/com/${this.orgName}/${this.modName}/ModBlocks.java`;
    }

    /**
     *
     * @param {string} orgName
     * @param {string} modName
     */
    constructor(orgName, modName) {
        this.orgName = orgName.toLowerCase();
        this.modName = modName.toLowerCase();

        /**
         * @type {Map<string, Block>}
         */
        this.blocks = new Map();
    }
}