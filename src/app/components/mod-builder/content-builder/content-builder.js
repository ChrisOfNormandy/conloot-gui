import * as block_standard from './blocks/standard';

const builder = {
    blocks: {
        cache: new Map(),

        add: {
            standard: (name) => {
                if (builder.blocks.cache.has(name))
                    return;

                let block = block_standard.create(name);

                builder.blocks.cache.set(name, block);

                return block;
            }
        },

        write: {
            standard: block_standard.write
        }
    }
};

export default builder;