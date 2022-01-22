export class BlockProperties {
    toString() {
        let str = '';
        this._properties.forEach((p) => {
            if (p._)
                str += p.f();
        });

        return str;
    }

    constructor() {
        this.of_ = {
            material: null,
            dyeColor: null,
            materialColor: null
        };

        this.copy_ = {
            source: null
        };

        this.noCollission = {
            _: false,
            f: () => {
                return '.noCollision()';
            }
        };
        this.noOcclusion = {
            _: false,
            f: () => {
                return '.noOcclusion()';
            }
        };
        this.harvestLevel = {
            _: false,
            f: () => {
                return `.harvestLevel(${this.harvestLevel.v}f)`;
            },
            v: null
        };
        this.harvestTool = {
            _: false,
            f: () => {
                return `.harvestTool(${this.harvestTool.v})`;
            },
            v: null
        };
        this.friction = {
            _: false,
            f: () => {
                return `.friction(${this.friction.v})`;
            },
            v: null
        };
        this.speedFactor = {
            _: false,
            f: () => {
                return `.speedFactor(${this.speedFactor.v})`;
            },
            v: null
        };
        this.jumpFactor = {
            _: false,
            f: () => {
                return `.jumpFactor(${this.jumpFactor.v})`;
            },
            v: null
        };
        this.sound = {
            _: false,
            f: () => {
                return `.sound(${this.sound.v})`;
            },
            v: null
        };
        this.lightLevel = {
            _: false,
            f: () => {
                return '.lightLevel(new ToIntFunction<BlockState>() { @Override public int applyAsInt(BlockState value) { return lightLevel; } })';
            },
            i: ''
        };
        this.strength = {
            _: false,
            f: () => {
                return `.strength(${this.strength.v}f)`;
            },
            v: null
        };
        this.randomTicks = {
            _: false,
            f: () => {
                return '.randomTicks()';
            }
        };
        this.dynamicShape = {
            _: false,
            f: () => {
                return '.dynamicShape()';
            }
        };
        this.noDrops = {
            _: false,
            f: () => {
                return '.noDrops()';
            },
            v: null
        };
        this.lootFrom = {
            _: false,
            f: () => {
                return `.lootFrom(${this.lootFrom.v})`;
            },
            v: null // Supplier<? extends Block> blockIn
        };
        this.air = {
            _: false,
            f: () => {
                return '.air()';
            }
        };
        this.isValidSpawn = {
            _: false,
            f: () => {
                return `.isValidSpawn(${this.isValidSpawn.v})`;
            },
            v: null // AbstractBlock.IExtendedPositionPredicate<EntityType<?>>
        };
        this.isRedstoneConductor = {
            _: false,
            f: () => {
                return `.isRedstoneConductor(${this.isRedstoneConductor.v}f)`;
            },
            v: null // AbstractBlock.IPositionPredicate
        };
        this.isSuffocating = {
            _: false,
            f: () => {
                return `.isSuffocating(${this.isSuffocating.v}f)`;
            },
            v: null // AbstractBlock.IPositionPredicate
        };

        this._properties = [
            this.noCollission,
            this.noOcclusion,
            this.harvestLevel,
            this.harvestTool,
            this.friction,
            this.speedFactor,
            this.jumpFactor,
            this.sound,
            this.lightLevel,
            this.strength,
            this.randomTicks,
            this.dynamicShape,
            this.noDrops,
            this.lootFrom,
            this.air,
            this.isValidSpawn,
            this.isRedstoneConductor,
            this.isSuffocating
        ];
    }
}

export default class Block {
    toString() {
        return `Standard.create("${this.name}", Properties.copy(Blocks.STONE)${this.properties.toString()}, ItemGroup.TAB_BUILDING_BLOCKS);`;
    }

    constructor(name) {
        this.name = name;
        this.properties = new BlockProperties();
    }
}